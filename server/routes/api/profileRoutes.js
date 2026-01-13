// server/routes/api/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/api/profileApiController');
const checkAuth = require('../../middleware/authMiddleware'); // Important !

// On protège ces routes avec le middleware checkAuth
router.get('/', checkAuth, profileController.getProfile);
router.put('/', checkAuth, profileController.updateProfile);

module.exports = router;