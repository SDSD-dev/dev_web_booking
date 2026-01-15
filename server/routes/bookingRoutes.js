// server/routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController.js');
const checkAuth = require('../middleware/authMiddleware');

// GET : Afficher le formulaire
router.get('/book/room/:id', checkAuth, bookingController.viewBookingRecap);

// POST : Traiter le formulaire
router.post('/book/validate', checkAuth, bookingController.validateBooking);

//Stripe
// URL déclenchée par le bouton "Payer" (Envoie vers Stripe)
router.post('/book/validate', checkAuth, bookingController.validateBooking);

// URL appelée par Stripe quand payé (Enregistre en BDD)
router.get('/booking/success', checkAuth, bookingController.finalizeBooking);

router.get('/booking/cancel', checkAuth, bookingController.cancelPayment);
router.post('/booking/cancel/:id', checkAuth, bookingController.cancelBooking);

module.exports = router;