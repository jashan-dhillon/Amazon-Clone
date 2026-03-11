const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const authenticateUser = require('../middleware/auth');

// POST /api/auth/signup - create a new account
router.post('/signup', signup);

// POST /api/auth/login - login with email & password
router.post('/login', login);

// GET /api/auth/profile - get logged in user's info (needs token)
router.get('/profile', authenticateUser, getProfile);

module.exports = router;
