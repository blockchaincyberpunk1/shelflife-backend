const express = require('express');  // Import the Express library
const router = express.Router();  // Create a new router object for handling authentication routes
const authController = require('../controllers/authController');  // Import the authentication controller
const { check } = require('express-validator');  // Import express-validator's `check` method for input validation
const { validate } = require('../middleware/validation');  // Import general validation middleware

/**
 * @route POST /signup
 * @description User signup route for registering new users
 * @access Public
 * 
 * This route allows a new user to sign up by providing necessary credentials like 
 * username, email, and password. It also includes optional profile picture validation.
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

    // Optional: Validate the profile picture URL, if provided
    check('profilePicture')
      .optional()
      .isURL()
      .withMessage('Invalid profile picture URL'),
  ],
  validate,  // Apply validation middleware to check for errors
  authController.signup  // Call the signup function from the authController if validation passes
);

/**
 * @route POST /login
 * @description User login route for authenticating users
 * @access Public
 * 
 * This route allows existing users to log in by providing valid email and password. 
 * It validates both fields before calling the login handler.
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
  validate,  // Apply validation middleware to check for errors
  authController.login  // Call the login function from the authController if validation passes
);

module.exports = router;  // Export the router object to be used in other parts of the application
