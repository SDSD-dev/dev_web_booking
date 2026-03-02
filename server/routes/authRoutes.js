// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // importation du contrôleur  
const checkAuth = require('../middleware/authMiddleware'); // vérification de la connection

// Pages (GET) -> appelle les fonctions du contrôleur
router.get('/register', authController.viewRegister);
router.get('/login', authController.viewLogin);
router.get('/profile', checkAuth, authController.viewProfile); // checkAuth -> middleware
router.get('/logout', checkAuth, authController.logout);

// Actions (POST)
router.post('/register', authController.register);
router.post('/login', authController.login);

// exporte
module.exports = router;