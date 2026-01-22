// server/routes/api/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelApiController = require('../../controllers/api/hotelApiController');
const checkAuth = require('../../middleware/authMiddleware');
const checkAdmin = require('../../middleware/adminMiddleware');

// GET : Récupérer la liste des hôtels (API)
router.get('/hotels', checkAuth, hotelApiController.getHotels);

// GET : resultât de recherche
router.get('/hotels/search', hotelApiController.searchHotels); // comme c'est public pas de checkAuth

// GET : Récupérer le détail d'un hôtel avec ses chambres (API)
router.get('/hotels/:id', hotelApiController.getHotelDetail); // comme c'est public pas de checkAuth

//CRUD
router.post('/hotels', checkAdmin, hotelApiController.createHotel);
router.put('/hotels/:id', checkAdmin, hotelApiController.updateHotel);
router.delete('/hotels/:id', checkAdmin, hotelApiController.deleteHotel);

module.exports = router;
