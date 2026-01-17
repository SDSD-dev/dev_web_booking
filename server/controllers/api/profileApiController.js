// server/controllers/api/profileApiController.js
const UserManager = require("../../models/UserManager");
const OrderManager = require("../../models/OrderManager")

// GET /api/profile
// Récupérer les infos du profil utilisateur
exports.getProfile = async (req, res) => {
    try {
        // L'ID vient de la session (établie au login)
        const userId = req.session.userId;
        
        if (!userId) {
            return res.status(401).json({ message: "Non connecté" });
        }

        const user = await UserManager.getById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable" });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// PUT /api/profile
// Mettre à jour les infos du profil utilisateur
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.status(401).json({ message: "Non connecté" });

        // On met à jour via le Manager
        await UserManager.update(userId, req.body);

        res.json({ message: "Profil mis à jour avec succès !" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur mise à jour" });
    }
};

exports.getBookings = async (req, res) => {
    try {        
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ message: "Non connecté" });
        }

        const history = await OrderManager.getHistoryByClientId(userId);

        res.json(history); 

    } catch (error) {
        console.error();
        res.status(500).json({});
    }
};

exports.cancelBooking = async (req, res) => {
    try {
        const userId = req.session.userId;
        const orderId = req.params.id;

        if (!userId) {
            return res.status(401).json({ message: "Non connecté" });
        };

        const cancelSucess = await OrderManager.cancelOrder(orderId, userId);

        if (cancelSucess) {
            res.json({ message: "Commande annulée avec succès" });
        } else {
            res.status(404).json({ message: "Commande introuvable ou impossible à annuler" });
        }
    } catch (error) {
        console.error("Erreur annulation:", error);
        res.status(500).json({message : "Erreur serveur" });
    }
    
};