const express = require('express');
const router = express.Router();
const {
  register,
  login,
  requestPasswordReset,
  resetPassword
} = require('./authController');

// PUBLIC_INTERFACE
/**
 * Authentication routes
 * @module authRoutes
 */

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Request password reset
router.post('/password-reset-request', requestPasswordReset);

// Reset password
router.post('/password-reset', resetPassword);

module.exports = router;