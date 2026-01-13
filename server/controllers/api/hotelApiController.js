// server/controllers/api/hotelApiController.js
const HotelManager = require("../../models/HotelManager");

// API pour obtenir la liste des hôtels
exports.getHotels = async (req, res) => {
    try {
        const hotels = await HotelManager.findAll();
        // Au lieu de res.render('dashboard', { hotels }), on fait :
        res.json(hotels); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// API pour obtenir le détail d'un hôtel avec ses chambres
exports.getHotelDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await HotelManager.getOneWithRooms(id);
        
        if (!data) {
            return res.status(404).json({ message: "Hôtel introuvable" });
        }

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};