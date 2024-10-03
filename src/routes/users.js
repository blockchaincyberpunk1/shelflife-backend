const express = require('express');  // Import Express
const router = express.Router();  // Create a new router for handling user routes
const userController = require('../controllers/userController');  // Import the userController
const { check } = require('express-validator');  // Import express-validator for input validation
const { authenticateJWT } = require('../middleware/authMiddleware');  // Import JWT authentication middleware
const { validate } = require('../middleware/validation');  // Import the validation middleware

/**
 * @route GET /users/profile
 * @description Get the authenticated user's profile
 * @access Private
 */
router.get(
  '/profile',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  userController.getUserProfile  // Call the userController to get the user profile
);

/**
 * @route PUT /users/profile
 * @description Update the authenticated user's profile (username, email, profile picture)
 * @access Private
 */
router.put(
  '/profile',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  [
    check('username')
      .optional()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be between 3 and 20 characters'),
    check('email')
      .optional()
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail(),  // Normalize email to lowercase
    check('profilePicture')
      .optional()
      .isURL()
      .withMessage('Invalid profile picture URL'),
  ],
  validate,  // Use the validation middleware to handle validation errors
  userController.updateUserProfile  // Call the userController to update the user profile
);

/**
 * @route PUT /users/password
 * @description Update the authenticated user's password
 * @access Private
 */
router.put(
  '/password',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  [
    check('oldPassword')
      .notEmpty()
      .withMessage('Old password is required'),
    check('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
  ],
  validate,  // Use the validation middleware to handle validation errors
  userController.updateUserPassword  // Call the userController to update the user password
);

module.exports = router;  // Export the router for use in the application
