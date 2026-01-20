// server/routes/api/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelApiController = require('../../controllers/api/hotelApiController');
const checkAuth = require('../../middleware/authMiddleware');

// GET : Récupérer la liste des hôtels (API)
router.get('/hotels', checkAuth, hotelApiController.getHotels);

// GET : resultât de recherche
router.get('/hotels/search', hotelApiController.searchHotels);

// GET : Récupérer le détail d'un hôtel avec ses chambres (API)
router.get('/hotels/:id', hotelApiController.getHotelDetail) // comme c'est public pas de checkAuth


module.exports = router;
