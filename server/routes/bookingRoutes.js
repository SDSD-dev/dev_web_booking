// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController.js');
const checkAuth = require('../middleware/authMiddleware');

// GET : Afficher le formulaire
router.get('/book/room/:id', checkAuth, bookingController.viewBookingRecap);

// POST : Traiter le formulaire
// router.post('/book/validate', checkAuth, bookingController.validateBooking);


module.exports = router;