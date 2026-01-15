// server/controllers/api/roomApiController.js
const RoomManager = require("../../models/RoomManager.js");

exports.getRoom = async (req, res) => {
    try {
        const id = req.params.id;
        const room = await RoomManager.getById(id);
        
        if (!room) {
            return res.status(404).json({Message : "Chambre introuvable"})
        }

        res.json(room);

    } catch (error) {
        console.error();
        res.status(500).json({Message : "Erreur serveur"})
    }
};