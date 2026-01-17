// server/routes/api/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/api/profileApiController');
const checkAuth = require('../../middleware/authMiddleware'); // Important !

// On protège ces routes avec le middleware checkAuth
router.get('/', checkAuth, profileController.getProfile);
router.put('/', checkAuth, profileController.updateProfile);
// GET /api/profile/bookings
router.get('/bookings', checkAuth, profileController.getBookings);
router.put('/bookings/:id/cancel', checkAuth, profileController.cancelBooking);

module.exports = router;