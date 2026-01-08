// server/controllers/api/hotelApiController.js
const HotelManager = require("../../models/HotelManager");

// Exactement la même logique, mais réponse différente
exports.getHotels = async (req, res) => {
    try {
        const hotels = await HotelManager.findAll();
        // Au lieu de res.render('dashboard', { hotels }), on fait :
        res.json(hotels); 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};