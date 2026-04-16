// server/routes/api/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/api/profileApiController');
const checkAuth = require('../../middleware/authMiddleware'); // Important !

// routes avec le middleware checkAuth pour protéger les données de l'utilisateur
router.get('/', checkAuth, profileController.getProfile);
router.put('/', checkAuth, profileController.updateProfile);
router.put('/password', checkAuth, profileController.updatePassword);
// router.get('/bookings', checkAuth, profileController.getBookings); // Historique des réservations
router.get('/bookings', checkAuth, profileController.getBookings);
router.put('/bookings/:id/cancel', checkAuth, profileController.cancelBooking);

module.exports = router;