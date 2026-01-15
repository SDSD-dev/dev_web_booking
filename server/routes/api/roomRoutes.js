// server/routes/api/roomRoutes.js
const express = require('express');
const router = express.Router();
const roomController = require ('../../controllers/api/roomApiController');

router.get('/:id', roomController.getRoom) // /api/rooms/id

module.exports = router;

