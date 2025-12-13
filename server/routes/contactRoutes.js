// server/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// GET : Afficher le formulaire
router.get('/contact', contactController.viewContact);

// POST : Traiter le formulaire
router.post('/contact', contactController.contact);

module.exports = router;