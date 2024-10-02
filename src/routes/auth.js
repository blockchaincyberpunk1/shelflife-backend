const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { check } = require('express-validator'); // For validation

// Sign up route
router.post('/signup', [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('username').notEmpty().withMessage('Username is required'),
  check('profilePicture').isURL().optional().withMessage('Invalid profile picture URL'), 
], authController.signup);

// Login route
router.post('/login', [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').exists().withMessage('Password is required'),
], authController.login);

module.exports = router;