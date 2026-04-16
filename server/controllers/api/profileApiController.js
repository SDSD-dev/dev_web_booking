// server/controllers/api/profileApiController.js
const UserManager = require("../../models/UserManager");
const OrderManager = require("../../models/OrderManager");
const bcrypt = require("bcrypt");

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

// GET /api/profile/bookings
// Récupérer l'historique des réservations de l'utilisateur
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

// DELETE /api/profile/bookings/:id
// Annuler une réservation
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

// modifier le mot de passe
exports.updatePassword = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: "Veuillez remplir tous les champs." });
        }

        // Récupération du mot de passe haché de la BDD
        const currentHashedPassword = await UserManager.getPasswordById(userId);

        if (!currentHashedPassword) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        // Vérification de l'ancien mot de passe
        const match = await bcrypt.compare(oldPassword, currentHashedPassword);

        if (!match) {
            return res.status(401).json({ message: "L'ancien mot de passe est incorrect." });
        }

        // Hacher le nouveau mot de passe
        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        // Save dans BDD
        await UserManager.updatePassword(userId, newHashedPassword);

        res.json({ message: "Mot de passe mis à jour avec succès !" });

    } catch (error) {
        console.error("Erreur updatePassword:", error);
        res.status(500).json({ message: "Erreur interne lors du changement de mot de passe." });
    }
}