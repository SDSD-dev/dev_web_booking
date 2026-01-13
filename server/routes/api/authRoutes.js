// server/routes/api/authRoutes.js
const express = require('express');
const router = express.Router();
const authApiController = require('../../controllers/api/authApiController');

// POST /api/auth/login
router.post('/login', authApiController.login);

//logout
router.post('/logout', authApiController.logout);

// Check Session 
router.get('/check', authApiController.checkSession);

//register
router.post('/register', authApiController.register);


module.exports = router;