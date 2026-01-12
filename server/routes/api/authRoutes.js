const express = require('express');
const router = express.Router();
const authApiController = require('../../controllers/api/authApiController');

// POST /api/auth/login
router.post('/login', authApiController.login);

//logout

//register


module.exports = router;