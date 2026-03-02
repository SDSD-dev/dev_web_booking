// server/routes/api/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactApiController = require('../../controllers/api/contactApiController');

// POST : Envoyer un message de contact
router.post("/", contactApiController.contact);

module.exports = router;