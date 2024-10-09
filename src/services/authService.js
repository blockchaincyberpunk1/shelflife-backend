const User = require('../models/User');  // Import the User model for database interaction
const bcrypt = require('bcrypt');  // Import bcrypt for hashing passwords and comparing them
const jwt = require('jsonwebtoken');  // Import JSON Web Token for generating and verifying tokens

/**
 * Signup Service
 * Handles the creation of a new user account.
 * 
 * @param {string} username - The username provided by the new user.
 * @param {string} email - The email provided by the new user.
 * @param {string} password - The plain-text password provided by the new user.
 * @param {string} [profilePicture] - (Optional) URL for the user's profile picture.
 * @returns {Promise<Object>} - Returns the newly created user object if successful.
 */
exports.signup = async (username, email, password, profilePicture) => {
  try {
    // 1. Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('Email or username is already in use');  // Custom error message for duplicate email/username
    }

    // 2. Hash the password using bcrypt with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create a new user instance with the hashed password and provided data
    const newUser = new User({
      username,
      email,
      password: hashedPassword,  // Store the hashed password in the database
      profilePicture: profilePicture || 'https://example.com/default-profile-pic.jpg',  // Use default picture if not provided
    });

    // 4. Save the new user in the database
    return await newUser.save();
  } catch (err) {
    // Log the error (optional: logger could be used here)
    // logger.error('Error during signup: ', err.message);
    throw err;  // Re-throw the error to be handled by the controller or calling function
  }
};

/**
 * Login Service
 * Handles user login and JWT token generation.
 * 
 * @param {string} email - The email provided by the user attempting to log in.
 * @param {string} password - The plain-text password provided by the user attempting to log in.
 * @returns {Promise<string>} - Returns a JWT token if login is successful.
 */
exports.login = async (email, password) => {
  try {
    // 1. Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');  // Error if the user is not found
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');  // Error if the passwords do not match
    }

    // 3. Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { sub: user._id },  // The JWT payload contains the user's unique ID
      process.env.JWT_SECRET,  // Use the JWT secret from environment variables
      { expiresIn: '1h' }  // Set the token's expiration time to 1 hour
    );

    // 4. Return the generated token
    return token;
  } catch (err) {
    // Log the error (optional: logger could be used here)
    // logger.error('Error during login: ', err.message);
    throw err;  // Re-throw the error to be handled by the controller or calling function
  }
};
