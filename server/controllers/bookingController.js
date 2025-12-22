// server/controllers/bookingController.js
const RoomManager = require("../models/RoomManager");
const HotelManager = require("../models/OrderManager");

exports.viewBookingRecap = async (req, res) => {
  try {
    // 1. Récupérer les infos
    const roomId = req.params.id; // L'ID dans l'URL (/book/room/42)
    const { date_debut, date_fin } = req.query; // Les dates venant de la recherche

    // Vérification basique des paramètres
    if (!roomId || !date_debut || !date_fin) {
        console.log("Paramètres manquants pour la réservation");
        return res.redirect('/'); // Ou afficher une erreur
    }

    // 2. Récupérer les infos OFFICIELLES de la chambre (Sécurité prix)
    // On réutilise votre méthode existante, mais il faudra peut-être une méthode getOneRoomById
    // Pour l'instant, supposons qu'on filtre les résultats ou qu'on crée getOneById dans RoomManager
    // Astuce : Créez une méthode static async getOneById(id) dans RoomManager !
    const chambre = await RoomManager.getOneById(roomId);

    if (!chambre) {
      return res.status(404).send("Chambre introuvable");
    };

    // 3. --- LOGIQUE MÉTIER (Calculs) ---
    const start = new Date(date_debut);
    const end = new Date(date_fin);
    // Calcul différence en jours
    const diffTime = Math.abs(end - start);
    const nbrNuits = Math.ceil(diffTime/ (1000 * 60 * 60 * 24));
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
            nbrNuits: nbrNuits
        },
        prix: {
            unitaire: chambre.prix_base,
            total: prixTotal
        }
    };
    // 5. Rendre la vue avec les données
    res.render("booking-recap", {
      title: "Récapitulatif",
      subtitle: "Confirmez votre réservation",
      recap: recapCommande,
      // On passe aussi l'utilisateur connecté pour pré-remplir le formulaire si besoin
      user: req.session.userId
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des réservations :", error);
    res.status(500).send("Erreur serveur");
  }
}