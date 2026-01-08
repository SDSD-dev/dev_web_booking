// server/routes/api/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelApiController = require('../../controllers/api/hotelApiController');
const checkAuth = require('../../middleware/authMiddleware');

// GET : Récupérer la liste des hôtels (API)
router.get('/hotels', checkAuth, hotelApiController.getHotels);

module.exports = router;
