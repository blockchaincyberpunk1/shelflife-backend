const express = require('express');  // Imporuserst Express
const router = express.Router();  // Create a new router for handling user routes
const userController = require('../controllers/userController');  // Import the userController
const { check } = require('express-validator');  // Import express-validator for input validation
const { authenticateJWT } = require('../middleware/authMiddleware');  // Import JWT authentication middleware
const { validate } = require('../middleware/validation');  // Import the validation middleware

/**
 * @route GET /users/:id
 * @description Fetch a user by their unique ID
 * @access Private (requires authentication)
 */
router.get(
  '/:id',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  userController.getUserById  // Call the controller to fetch user by ID
);

/**
 * @route GET /users/profile
 * @description Get the authenticated user's profile
 * @access Private (requires authentication)
 */
router.get(
  '/profile',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  userController.getUserProfile  // Call the controller to get the authenticated user's profile
);

/**
 * @route PUT /users/profile
 * @description Update the authenticated user's profile (username, email, profile picture)
 * @access Private (requires authentication)
 */
router.put(
  '/profile',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  [
    // Validation checks for profile fields
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
  userController.updateUserProfile  // Call the controller to update the user's profile
);

/**
 * @route PUT /users/password
 * @description Update the authenticated user's password
 * @access Private (requires authentication)
 */
router.put(
  '/password',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  [
    // Validation checks for password fields
    check('oldPassword')
      .notEmpty()
      .withMessage('Old password is required'),
    check('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
  ],
  validate,  // Use the validation middleware to handle validation errors
  userController.updateUserPassword  // Call the controller to update the user's password
);

/**
 * @route POST /users/forgot-password
 * @description Generate a password reset token and send it to the user's email
 * @access Public
 */
router.post(
  '/forgot-password',
  [
    check('email')
      .notEmpty()
      .isEmail()
      .withMessage('Please provide a valid email'),  // Validate the email input
  ],
  validate,  // Use the validation middleware to handle validation errors
  userController.generatePasswordResetToken  // Call the controller to generate and send the password reset token
);

/**
 * @route POST /users/reset-password
 * @description Reset the user's password using a valid reset token
 * @access Public
 */
router.post(
  '/reset-password',
  [
    // Validation checks for token and new password
    check('token').notEmpty().withMessage('Reset token is required'),
    check('newPassword')
      .isLength({ min: 6 })
      .withMessage('New password must be at least 6 characters long'),
  ],
  validate,  // Use the validation middleware to handle validation errors
  userController.resetPassword  // Call the controller to reset the user's password
);

/**
 * @route PUT /users/settings
 * @description Update user-specific settings (e.g., notifications, email preferences)
 * @access Private (requires authentication)
 */
router.put(
  '/settings',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  [
    // Optional validation checks for settings (can be customized further)
    check('settings.notificationsEnabled')
      .optional()
      .isBoolean()
      .withMessage('Invalid value for notificationsEnabled'),
    check('settings.emailPreference')
      .optional()
      .isIn(['daily', 'weekly', 'monthly'])
      .withMessage('Invalid email preference value'),
  ],
  validate,  // Use the validation middleware to handle validation errors
  userController.updateUserSettings  // Call the controller to update the user's settings
);

/**
 * @route GET /users/settings
 * @description Fetch the authenticated user's settings
 * @access Private (requires authentication)
 */
router.get(
  '/settings',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  userController.fetchUserSettings  // Call the controller to fetch the user's settings
);

/**
 * @route POST /users/refresh-token
 * @description Refresh the JWT token for the authenticated user
 * @access Private (requires authentication)
 */
router.post(
  '/refresh-token',
  authenticateJWT,  // Protect this route with JWT authentication middleware
  userController.refreshToken  // Call the controller to refresh the user's JWT token
);

module.exports = router;  // Export the router for use in the application
