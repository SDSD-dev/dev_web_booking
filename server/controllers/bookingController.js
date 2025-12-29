// server/controllers/bookingController.js
const RoomManager = require("../models/RoomManager");
const OrderManager = require("../models/OrderManager");
// Initialisation de Stripe + clé secrète (sk_test)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Afficher le récapitulatif de la réservation avant validation
exports.viewBookingRecap = async (req, res) => {
  try {
    // 1. Récupérer les infos
    const roomId = req.params.id; // L'ID dans l'URL (/book/room/42)
    const { date_debut, date_fin } = req.query; // Les dates venant de la recherche

    // Vérification basique des paramètres
    if (!roomId || !date_debut || !date_fin) {
      console.log("Paramètres manquants pour la réservation");
      return res.redirect("/"); // Ou afficher une erreur
    }

    // 2. Récupérer les infos OFFICIELLES de la chambre (Sécurité prix)
    // On réutilise votre méthode existante, mais il faudra peut-être une méthode getOneRoomById
    // Pour l'instant, supposons qu'on filtre les résultats ou qu'on crée getOneById dans RoomManager
    // Astuce : Créez une méthode static async getOneById(id) dans RoomManager !
    const chambre = await RoomManager.getOneById(roomId);

    if (!chambre) {
      return res.status(404).send("Chambre introuvable");
    }

    // 3. --- LOGIQUE MÉTIER (Calculs) ---
    const start = new Date(date_debut);
    const end = new Date(date_fin);
    // Calcul différence en jours
    const diffTime = Math.abs(end - start);
    const nbrNuits = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Sécurité : Vérifier que c'est au moins 1 nuit
    if (nbrNuits < 1) {
      return res.send("Erreur de dates : Le départ doit être après l'arrivée.");
    }
    // Calcul du prix total basé sur le prix BDD
    const prixTotal = chambre.prix_base * nbrNuits;
    // 4. Préparer l'objet pour la vue (Le "Panier")
    const recapCommande = {
      chambre: chambre,
      dates: {
        debut: date_debut,
        fin: date_fin,
        nbrNuits: nbrNuits,
      },
      prix: {
        unitaire: chambre.prix_base,
        total: prixTotal,
      },
    };
    // 5. Rendre la vue avec les données
    res.render("booking-recap", {
      title: "Récapitulatif",
      subtitle: "Confirmez votre réservation",
      recap: recapCommande,
      // On passe aussi l'utilisateur connecté pour pré-remplir le formulaire si besoin
      user: req.session.userId,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    res.status(500).send("Erreur serveur");
  }
};

// Valider la réservation et lancer le paiement Stripe
exports.validateBooking = async (req, res) => {
  try {
    // 1. Récupérer toutes les données du formulaire caché
    const {
      chambre_id,
      hotel_id,
      date_debut,
      date_fin,
      nbr_nuits,
      prix_unitaire,
      prix_total,
    } = req.body;

    const userId = req.session.userId; // L'utilisateur connecté

    // Sécurité basique
    if (!userId) return res.redirect("/login");

    // 2. Créer une session de paiement Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      // Info pour l'utilisateur sur Stripe
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Réservation Chambre #${chambre_id}`,
              description: `Séjour du ${date_debut} au ${date_fin} (${nbr_nuits} nuits)`,
            },
            // ATTENTION : Stripe compte en centimes ! (10.00€ = 1000)
            unit_amount: Math.round(parseFloat(prix_total) * 100),
          },
          quantity: 1,
        },
      ],
      // METADATA envoyé à Stripe -> renvoyé après paiement
      // Attention : tout convertir en String
      metadata: {
        client_id: userId,
        hotel_id: hotel_id,
        chambre_id: chambre_id,
        date_debut: date_debut,
        date_fin: date_fin,
        nbr_nuits: nbr_nuits,
        prix_unitaire: prix_unitaire,
        prix_total: prix_total,
      },
      // URLs de redirection
      // {CHECKOUT_SESSION_ID} sera remplacé automatiquement par Stripe
      success_url: `${process.env.DOMAIN}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.DOMAIN}/booking/cancel`, // Page si annulé
    });

    // 3. Rediriger l'utilisateur vers la page Stripe
    res.redirect(303, session.url);

  } catch (error) {
    console.error("Erreur initialisation Stripe :", error);
    res.status(500).send("Erreur lors de la connexion au service de paiement.");
  }
};

// Finaliser la réservation après paiement réussi
exports.finalizeBooking = async (req, res) => {
  try {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.redirect("/");
    }

    // 1. Vérifier auprès de Stripe que la session est bien payée
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
        return res.send("Le paiement n'a pas été validé.");
    }

    // 2. Récupérer nos infos cachées (Metadata)
    const data = session.metadata;

    // 3. Construire l'objet pour OrderManager
    const orderData = {
      client_id: data.client_id,
      hotel_id: data.hotel_id,
      chambre_id: data.chambre_id,
      date_debut: data.date_debut,
      date_fin: data.date_fin,
      nbr_nuits: data.nbr_nuits,
      prix_unitaire: data.prix_unitaire,
      prix_total: data.prix_total,
    };
    // 4. Enregistrer en Base de Données
    // C'est ici que l'anti-doublon d'OrderManager va travailler
    const orderId = await OrderManager.createOrder(orderData);

    // 5. Afficher la page de succès
    res.render("booking-success", { orderId: orderId,
      title: "Réservation",
      subtitle: "Bravo ! Commande ${orderId} validée.", });
  } catch {
    console.error("Erreur finalisation :", error);

    if (error.message === "ROOM_ALREADY_BOOKED") {
      return res.render("booking-recap", {
        title: "Oups !",
        subtitle: "Trop tard...",
        error:
          "Désolé, cette chambre vient d'être réservée par quelqu'un d'autre à l'instant.",
        recap: null,
        user: req.session.userId,
      });
    }
  }
};

// Page d'annulation de réservation
exports.cancelBooking = async (req, res) => {
  try {
    res.render("booking-cancel", {
      title: "Réservation",
      subtitle: "Annulation", });
  } catch {
    console.error("Erreur", error);
    }
  }
