
// server/controllers/api/bookingApiController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const RoomManager = require("../../models/RoomManager.js");
const OrderManager = require("../../models/OrderManager.js");

// Création de la session de paiement Stripe
exports.createCheckoutSession = async (req, res) => {
    try {
        // Récupération de données envoyé par Angular
        const { roomId, dates, total, travelers } = req.body;
        const userId = req.session.userId; // l'utilisateur connecté

        if (!userId) {
            return res.status(401).json({ message: "Non connecté" });
        };

        // Sécurité : vérification du prix coté serveur
        const room = await RoomManager.getById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Chambre introuvable" });
        }; 

        // Pour le retour vers Angular et pas vers Node.js
        // const DOMAIN = 'http://localhost:4200';
        const DOMAIN_ANGULAR = `${process.env.DOMAIN_ANGULAR}`;

        const customerEmail = req.session.userInfos ? req.session.userInfos.email : undefined;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Réservation : ${room.type_chambre}`,
                            description: `Du ${dates.dateDebut} au ${dates.dateFin}`,
                        },
                        unit_amount: Math.round(total * 100), 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${DOMAIN_ANGULAR}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN_ANGULAR}/profile`,
            customer_email: customerEmail, 
            metadata: {
                user_id: userId,
                room_id: roomId,
                date_debut: dates.dateDebut,
                date_fin: dates.dateFin,
                total_price: total,
                nbr_adulte: travelers.adults,
                nbr_enfant: travelers.children
            }
        });

        // renvoie l'URL à Angular
        res.json({ url: session.url });


    } catch (error) {
        console.error("Erreur Stripe:", error);
        res.status(500).json({ message : "Erreur lors de la création du paiement"})
    }
};

// Confirmation du paiement et création de la réservation
exports.confirmPayment = async (req, res) => {

    try {
        const { sessionId } = req.body;

        if (!sessionId) {
             return res.status(400).json({ message: "Session ID manquant" });
        }

        // Vérification Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: "Paiement non validé." });
        }
        
        // Récupération des données Stripe
        const { user_id, room_id, date_debut, date_fin, total_price, nbr_adulte, nbr_enfant } = session.metadata;

        // PRÉPARATION DES DONNÉES pour OrderManager -> il faut hotel_id, prix unitaire et nbr de nuits
        // Récupération de l'ID
        const room = await RoomManager.getById(room_id);

        if (!room) {
            throw new Error("Chambre introuvable pour validation commande");
        };
        // Calculer du nombre de nuits
        const start = new Date(date_debut);
        const end = new Date(date_fin);
        const diffTime = Math.abs(end - start);
        const nbr_nuits = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Calculer prix unitaire (Moyenne)
        const prix_unitaire = Number(total_price) / nbr_nuits;

        // Enregistrer la commande en base via la méthode OrderManager.createOrder
        const newOrderId = await OrderManager.createOrder({
            client_id: user_id,
            hotel_id: room.hotel_id, // Récupéré via RoomManager
            chambre_id: room_id,
            date_debut: date_debut,
            date_fin: date_fin,
            prix_total: total_price,
            prix_unitaire: prix_unitaire,
            nbr_nuits: nbr_nuits,
            nbr_adulte: Number(nbr_adulte),
            nbr_enfant: Number(nbr_enfant)
        });

        res.json({ success: true, reservationId: newOrderId });


    } catch (error) {
        console.error("Erreur confirmation:", error);
        // Gestion de l'erreur -> "ROOM_ALREADY_BOOKED"
        if (error.message === 'ROOM_ALREADY_BOOKED') {
            return res.status(409).json({ 
                success: false, 
                message: "Oups ! Cette chambre a été réservée par quelqu'un d'autre pendant votre paiement." 
            });
        }
        res.status(500).json({ message: "Erreur lors de l'enregistrement de la commande" });
    }
};