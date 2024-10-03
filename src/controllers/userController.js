const User = require('../models/User');  // Import the User model
const bcrypt = require('bcrypt');  // Import bcrypt for password hashing and comparison
const logger = require('../utils/logger');  // Import Winston logger for logging
const { validationResult } = require('express-validator');  // Import express-validator for input validation
const jwt = require('jsonwebtoken');  // Import JWT for token creation (optional for token refreshing)

/**
 * Get the authenticated user's profile data
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user (via JWT)

    // Fetch the user's profile based on their ID
    const user = await User.findById(userId).select('-password');  // Exclude the password field from the result

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User profile retrieved successfully",
      data: user
    });
    logger.info(`User profile retrieved for user ${userId}`);
  } catch (err) {
    logger.error(`Error retrieving user profile for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Update the authenticated user's profile
 * Allows updating fields like username, email, and profile picture
 */
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user
    const { username, email, profilePicture } = req.body;  // Extract fields from the request body

    // Validate input (this assumes express-validator middleware is applied)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Profile update validation failed', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    // Find and update the user's profile data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');  // Exclude password from the result

    res.json({
      message: "User profile updated successfully",
      data: updatedUser
    });
    logger.info(`User profile updated for user ${userId}`);
  } catch (err) {
    logger.error(`Error updating user profile for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Update the authenticated user's password
 * Ensures old password matches before allowing update
 */
exports.updateUserPassword = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user
    const { oldPassword, newPassword } = req.body;  // Extract old and new passwords from the request body

    // Validate input (this assumes express-validator middleware is applied)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Password update validation failed', { errors: errors.array() });
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user and validate the old password
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);  // Compare old password with stored hash
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash the new password and update it
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();  // Save the updated user with the new password

    res.json({ message: "Password updated successfully" });
    logger.info(`Password updated for user ${userId}`);
  } catch (err) {
    logger.error(`Error updating password for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Refresh JWT token
 * This allows refreshing the token for the authenticated user, if needed
 */
exports.refreshToken = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user

    // Generate a new token with the same user information
    const token = jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: "Token refreshed successfully",
      token
    });
    logger.info(`Token refreshed for user ${userId}`);
  } catch (err) {
    logger.error(`Error refreshing token for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};
