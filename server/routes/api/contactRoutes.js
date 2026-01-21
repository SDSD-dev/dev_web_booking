// server/routes/api/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactApiController = require('../../controllers/api/contactApiController');

router.post("/", contactApiController.contact);

module.exports = router;