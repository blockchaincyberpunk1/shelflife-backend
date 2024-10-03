const express = require('express');  // Import the Express library
const router = express.Router();  // Create a new router object for handling authentication routes
const authController = require('../controllers/authController');  // Import the authentication controller
const { check } = require('express-validator');  // Import express-validator's `check` method for input validation
const { validate } = require('../middleware/validation');  // Import general validation middleware

/**
 * User Signup Route
 * @route POST /signup
 * @description Allows new users to sign up by providing username, email, and password
 * @access Public
 */
router.post(
  '/signup',
  [
    // Validate the username: it must be non-empty and between 3 and 20 characters
    check('username')
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),

    // Validate the email: it must be a valid email format
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),  // Normalize email to lowercase for consistency

    // Validate the password: it must be at least 6 characters long
    check('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),

    // Optional profile picture validation: if provided, it must be a valid URL
    check('profilePicture')
      .optional()
      .isURL()
      .withMessage('Invalid profile picture URL'),
  ],
  validate,  // Apply general validation middleware to handle any validation errors
  authController.signup  // Call the signup function from the authController if validation passes
);

/**
 * User Login Route
 * @route POST /login
 * @description Allows users to log in by providing email and password
 * @access Public
 */
router.post(
  '/login',
  [
    // Validate the email: it must be a valid email format
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),  // Normalize email to lowercase for consistency

    // Validate the password: it must exist in the request
    check('password')
      .exists()
      .withMessage('Password is required'),
  ],
  validate,  // Apply general validation middleware to handle any validation errors
  authController.login  // Call the login function from the authController if validation passes
);

/**
 * Optional Route: Refresh JWT Token
 * Implement token refreshing functionality
 * This would allow users to refresh their JWT tokens after expiration.
 */
// router.post('/refresh-token', authController.refreshToken);

module.exports = router;  // Export the router object to be used in other parts of the application
