const userService = require('../services/userService'); // Import userService to handle business logic
const logger = require('../utils/logger'); // Import logger for activity logging
const { validationResult } = require('express-validator'); // Import express-validator for request validation
const jwt = require('jsonwebtoken'); // Import JWT for token creation (used for refreshing tokens)

/**
 * Fetch a user by their unique ID.
 * @route GET /users/:id
 * @description This function retrieves a user's information based on the provided ID.
 * @param {string} req.params.id - The ID of the user to fetch
 * @returns {Object} - The user data (excluding sensitive information like password)
 */
exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id; // Extract the user ID from the request parameters
    const user = await userService.getUserById(userId); // Fetch the user from the service layer

    res.json({
      message: "User retrieved successfully",
      data: user
    });
    logger.info(`User retrieved: ${userId}`); // Log the successful retrieval
  } catch (err) {
    logger.error(`Error fetching user with ID: ${req.params.id}`, { error: err.message }); // Log error
    next(err); // Pass error to error-handling middleware
  }
};

/**
 * Fetch the authenticated user's profile data.
 * @route GET /users/profile
 * @description This function fetches the profile of the authenticated user.
 * @param {string} req.user._id - The authenticated user's ID (from JWT)
 * @returns {Object} - The user profile data (excluding password)
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the authenticated user's ID from JWT
    const userProfile = await userService.getUserProfile(userId); // Fetch the profile from userService

    res.json({
      message: "User profile retrieved successfully",
      data: userProfile
    });
    logger.info(`User profile retrieved for user ${userId}`); // Log the retrieval
  } catch (err) {
    logger.error(`Error retrieving user profile for user ${req.user._id}`, { error: err.message });
    next(err);
  }
};

/**
 * Update the authenticated user's profile.
 * @route PUT /users/profile
 * @description This function allows the authenticated user to update their profile information.
 * @param {Object} req.body - The updated fields (username, email, profile picture)
 * @returns {Object} - The updated user profile data
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the user ID from JWT
    const { username, email, profilePicture } = req.body; // Extract updated fields

    // Validate input using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Profile update validation failed', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    // Update the profile using the service layer
    const updatedUser = await userService.updateUserProfile(userId, { username, email, profilePicture });

    res.json({
      message: "User profile updated successfully",
      data: updatedUser
    });
    logger.info(`User profile updated for user ${userId}`);
  } catch (err) {
    logger.error(`Error updating user profile for user ${req.user._id}`, { error: err.message });
    next(err);
  }
};

/**
 * Update the authenticated user's password.
 * @route PUT /users/password
 * @description This function allows the user to update their password after verifying the old one.
 * @param {Object} req.body - Contains the oldPassword and newPassword fields
 * @returns {String} - Success message indicating password update
 */
exports.updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the user ID from JWT
    const { oldPassword, newPassword } = req.body; // Extract old and new password from request body

    // Validate input using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Password update validation failed', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    // Call the service to handle password update
    await userService.updateUserPassword(userId, oldPassword, newPassword);

    res.json({ message: "Password updated successfully" });
    logger.info(`Password updated for user ${userId}`);
  } catch (err) {
    logger.error(`Error updating password for user ${req.user._id}`, { error: err.message });
    next(err);
  }
};

/**
 * Generate a password reset token and send it to the user's email.
 * @route POST /auth/forgot-password
 * @description Generates a token to reset the user's password and sends it to the provided email.
 * @param {string} req.body.email - The user's email address
 * @returns {String} - Success message indicating reset email sent
 */
exports.generatePasswordResetToken = async (req, res, next) => {
  try {
    const { email } = req.body; // Extract email from request body

    // Call service to generate reset token and send email
    await userService.generatePasswordResetToken(email);

    res.json({ message: "Password reset email sent successfully" });
    logger.info(`Password reset email sent to ${email}`);
  } catch (err) {
    logger.error(`Error generating password reset token for ${req.body.email}`, { error: err.message });
    next(err);
  }
};

/**
 * Reset the user's password using a valid reset token.
 * @route POST /auth/reset-password
 * @description Resets the user's password if the token is valid.
 * @param {string} req.body.token - The password reset token
 * @param {string} req.body.newPassword - The new password to set
 * @returns {String} - Success message indicating password reset
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body; // Extract token and new password from request body

    // Call service to reset the password
    await userService.resetPassword(token, newPassword);

    res.json({ message: "Password reset successfully" });
    logger.info("Password reset successfully");
  } catch (err) {
    logger.error("Error resetting password", { error: err.message });
    next(err);
  }
};

/**
 * Update user-specific settings (e.g., notifications, email preferences).
 * @route PUT /users/settings
 * @description Allows the user to update their notification and email preferences.
 * @param {Object} req.body.settings - The updated settings data
 * @returns {Object} - The updated user settings
 */
exports.updateUserSettings = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the user ID from JWT
    const settingsData = req.body.settings; // Extract settings data from request body

    // Update settings using service layer
    const updatedUser = await userService.updateUserSettings(userId, settingsData);

    res.json({
      message: "User settings updated successfully",
      data: updatedUser.settings
    });
    logger.info(`User settings updated for user ${userId}`);
  } catch (err) {
    logger.error(`Error updating settings for user ${req.user._id}`, { error: err.message });
    next(err);
  }
};

/**
 * Fetch user-specific settings (e.g., notification preferences).
 * @route GET /users/settings
 * @description Fetches the user's notification and email preferences.
 * @returns {Object} - The user's settings
 */
exports.fetchUserSettings = async (req, res, next) => {
  try {
    const userId = req.user._id; // Get the user ID from JWT

    // Fetch settings using service layer
    const settings = await userService.fetchUserSettings(userId);

    res.json({
      message: "User settings retrieved successfully",
      data: settings
    });
    logger.info(`User settings retrieved for user ${userId}`);
  } catch (err) {
    logger.error(`Error retrieving settings for user ${req.user._id}`, { error: err.message });
    next(err);
  }
};

/**
 * Refresh the JWT token for the authenticated user.
 * @route POST /auth/refresh-token
 * @description This function refreshes the JWT token for the authenticated user.
 * @returns {Object} - New JWT token
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const userId = req.user._id; // Extract the user ID from the JWT

    // Generate a new JWT token
    const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: "Token refreshed successfully",
      token
    });
    logger.info(`Token refreshed for user ${userId}`);
  } catch (err) {
    logger.error(`Error refreshing token for user ${req.user._id}`, { error: err.message });
    next(err);
  }
};
