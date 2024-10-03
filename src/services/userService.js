const User = require("../models/User"); // Import the User model
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing and comparison
const crypto = require("crypto"); // Import crypto for generating secure random tokens
const emailService = require("../utils/email"); // Import the email service for sending emails

/**
 * Fetch a user by their unique ID
 * @param {string} userId - The ID of the user
 * @returns {Promise<Object>} - The user object if found, otherwise null
 */
exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId); // Fetch user by ID from the database
    if (!user) {
      throw new Error("User not found"); // Handle case where the user is not found
    }
    return user;
  } catch (err) {
    throw err;
  }
};

/**
 * Update a user's profile
 * @param {string} userId - The ID of the user
 * @param {Object} updateData - An object containing the fields to update
 * @returns {Promise<Object>} - The updated user object
 */
exports.updateUserProfile = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      throw new Error("User not found or unable to update");
    }
    return updatedUser;
  } catch (err) {
    throw err;
  }
};

/**
 * Update a user's password
 * @param {string} userId - The ID of the user
 * @param {string} currentPassword - The user's current password
 * @param {string} newPassword - The new password to be set
 * @returns {Promise<boolean>} - Returns true if the password is successfully updated, otherwise false
 */
exports.updateUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Compare the current password with the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect");
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return true; // Password update was successful
  } catch (err) {
    throw err;
  }
};

/**
 * Generate a password reset token, store it on the user, and send a reset email
 * @param {string} email - The email of the user requesting the reset
 * @returns {Promise<void>}
 */
exports.generatePasswordResetToken = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("User not found");
    }

    // Generate a secure random token using crypto
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set the reset token and expiration on the user model
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex"); // Hash the token before storing it
    user.passwordResetExpires = Date.now() + 3600000; // Token expires in 1 hour

    await user.save();

    // Send a password reset email with the reset token
    await emailService.sendPasswordResetEmail(user.email, resetToken);
  } catch (err) {
    throw err;
  }
};

/**
 * Reset a user's password using a valid reset token
 * @param {string} token - The password reset token provided by the user
 * @param {string} newPassword - The new password to be set
 * @returns {Promise<void>}
 */
exports.resetPassword = async (token, newPassword) => {
  try {
    // Hash the provided token to compare it with the hashed token stored in the database
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by the reset token and check if the token is still valid
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }, // Ensure the token hasn't expired
    });

    if (!user) {
      throw new Error("Invalid or expired token");
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the reset token and expiration fields
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save(); // Save the updated user with the new password
  } catch (err) {
    throw err;
  }
};
