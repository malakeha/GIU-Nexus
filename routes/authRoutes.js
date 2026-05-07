// ============================================================
// authRoutes.js  —  ALI's file
// Wires all authentication endpoints.
// ============================================================
const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/auth');

// Auth controllers
const { register, login, logout } = require('../controllers/authController');
const { forgotPassword, resetPassword } = require('../controllers/passwordController');

// Public
router.post('/register',       register);
router.post('/login',          login);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Private
router.post('/logout', protect, logout);

module.exports = router;