// 1. IMPORT
// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // importation du contrôleur  
const checkAuth = require('../middleware/authMiddleware'); // vérification de la connection

// 2. DÉFINITION
// Pages (GET) -> appelle les fonctions du contrôleur
router.get('/register', authController.viewRegister);
router.get('/login', authController.viewLogin);
router.get('/profile', checkAuth, authController.viewProfile); // checkAuth -> middleware
router.get('/logout', checkAuth, authController.logout);

// 3. EXPORT (Pour que server.js puisse l'utiliser)
// Actions (POST)
router.post('/register', authController.register);
router.post('/login', authController.login);

// 4. exporte
module.exports = router;