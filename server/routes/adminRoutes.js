// server/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const checkAdmin = require('../middleware/adminMiddleware');

// Protection de la route avec checkAdmin
router.get('/dashboard', checkAdmin, adminController.viewDashboard);

// CRUD Hôtels
// Ajouter un hôtel (Formulaire)
router.get('/hotel/new', checkAdmin, adminController.viewAddHotel)
// Ajouter un hôtel (Action)
router.post('/hotel/new', checkAdmin, adminController.createHotel)
// Supprimer un hôtel (Action)
router.get('/hotel/delete/:id', checkAdmin, adminController.deleteHotel);

// Modification (Affichage du formulaire pré-rempli)
router.get('/hotel/edit/:id', checkAdmin, adminController.viewEditHotel);
// Éditer un hôtel (Formulaire)
router.post('/hotel/edit/:id', checkAdmin, adminController.updateHotel);

module.exports = router;
