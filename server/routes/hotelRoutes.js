// server/routes/hotelRoutes.js
const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// GET : Afficher le formulaire
router.get('/search', hotelController.viewSearch);
// router.get('/hotel/:id', hotelController.viewHotelDetails);

// POST : Traiter le formulaire


module.exports = router;