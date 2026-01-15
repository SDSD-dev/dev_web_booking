// server/routes/api/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/api/bookingApiController');
const checkAuth = require('../../middleware/authMiddleware');

// POST /api/booking/checkout
router.post('/checkout', checkAuth, bookingController.createCheckoutSession);

// POST /api/booking/success
router.post('/success', bookingController.confirmPayment);

module.exports = router;