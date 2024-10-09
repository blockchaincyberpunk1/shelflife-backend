const User = require("../models/User"); // Import the User model for database operations
const bcrypt = require("bcrypt"); // Import bcrypt for password hashing and comparison
const crypto = require("crypto"); // Import crypto for generating secure random tokens
const emailService = require("../utils/email"); // Import the email service for sending password reset emails

/**
 * Fetch a user by their unique ID.
 * @param {string} userId - The ID of the user to fetch.
 * @returns {Promise<Object>} - The user object if found, otherwise throws an error.
 */
exports.getUserById = async (userId) => {
  try {
    const user = await User.findById(userId); // Find the user in the database by ID
    if (!user) {
      throw new Error("User not found"); // Throw an error if the user does not exist
    }
    return user; // Return the user object if found
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};

/**
 * Fetch the user's profile data.
 * @param {string} userId - The ID of the user whose profile is being fetched.
 * @returns {Promise<Object>} - The user's profile data excluding sensitive information like the password.
 */
exports.getUserProfile = async (userId) => {
  try {
    const user = await User.findById(userId).select("-password -passwordResetToken -passwordResetExpires"); // Fetch user data without sensitive fields
    if (!user) {
      throw new Error("User not found"); // Throw an error if the user is not found
    }
    return user; // Return the user profile data
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};

/**
 * Update a user's profile details (e.g., username, email, profile picture).
 * @param {string} userId - The ID of the user whose profile is being updated.
 * @param {Object} updateData - An object containing the updated fields.
 * @returns {Promise<Object>} - The updated user object if successful.
 */
exports.updateUserProfile = async (userId, updateData) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return the updated user object
      runValidators: true, // Ensure the new data adheres to schema validation rules
    });
    if (!updatedUser) {
      throw new Error("User not found or unable to update"); // Throw an error if the user is not found
    }
    return updatedUser; // Return the updated user object
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};

/**
 * Update a user's password.
 * @param {string} userId - The ID of the user whose password is being updated.
 * @param {string} currentPassword - The user's current password for verification.
 * @param {string} newPassword - The new password the user wants to set.
 * @returns {Promise<boolean>} - Returns true if the password is updated successfully.
 */
exports.updateUserPassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId); // Fetch the user by ID
    if (!user) {
      throw new Error("User not found"); // Throw an error if the user is not found
    }

    // Compare the provided current password with the stored hashed password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new Error("Current password is incorrect"); // Throw an error if the passwords don't match
    }

    // Hash the new password and update the user's password in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save(); // Save the changes to the database

    return true; // Return true indicating password update was successful
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};

/**
 * Generate a password reset token, store it on the user, and send a reset email.
 * @param {string} email - The email of the user requesting the password reset.
 * @returns {Promise<void>} - Sends a password reset email to the user.
 */
exports.generatePasswordResetToken = async (email) => {
  try {
    const user = await User.findOne({ email }); // Find the user by email
    if (!user) {
      throw new Error("User not found"); // Throw an error if the user is not found
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and store it on the user model with an expiry time
    user.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.passwordResetExpires = Date.now() + 3600000; // Set expiry to 1 hour from now

    await user.save(); // Save the updated user with the token

    // Send the password reset email with the token to the user
    await emailService.sendPasswordResetEmail(user.email, resetToken);
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};

/**
 * Reset a user's password using a valid reset token.
 * @param {string} token - The password reset token provided by the user.
 * @param {string} newPassword - The new password the user wants to set.
 * @returns {Promise<void>} - Updates the password if the token is valid and resets the token.
 */
exports.resetPassword = async (token, newPassword) => {
  try {
    // Hash the provided token to compare with the stored hashed token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by the hashed token and ensure the token hasn't expired
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Invalid or expired token"); // Throw an error if the token is invalid or expired
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the reset token and expiry once the password is updated
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save(); // Save the updated user to the database
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};


/**
 * Update user-specific settings such as notifications and email preferences.
 * @param {string} userId - The ID of the user whose settings are being updated.
 * @param {Object} settingsData - The updated settings data.
 * @returns {Promise<Object>} - The updated user object with the new settings.
 */
exports.updateUserSettings = async (userId, settingsData) => {
  try {
    // Update the user's settings in the database
    const updatedUser = await User.findByIdAndUpdate(userId, { settings: settingsData }, { new: true });
    if (!updatedUser) {
      throw new Error("User not found or unable to update settings"); // Throw error if user not found
    }
    return updatedUser; // Return the updated user object
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};

/**
 * Fetch user-specific settings (e.g., notification preferences).
 * @param {string} userId - The ID of the user whose settings are being fetched.
 * @returns {Promise<Object>} - The user's settings object.
 */
exports.fetchUserSettings = async (userId) => {
  try {
    // Find the user by ID and return only the settings field
    const user = await User.findById(userId).select("settings");
    if (!user) {
      throw new Error("User not found"); // Throw an error if the user is not found
    }
    return user.settings; // Return the user's settings
  } catch (err) {
    throw err; // Pass the error to the calling function
  }
};
