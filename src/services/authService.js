const User = require('../models/User');  // Import the User model
const bcrypt = require('bcrypt');  // Import bcrypt for password hashing and comparison
const jwt = require('jsonwebtoken');  // Import JWT for token creation and verification

/**
 * User Signup Service
 * @param {string} username - The username of the new user
 * @param {string} email - The email of the new user
 * @param {string} password - The plain text password of the new user
 * @param {string} [profilePicture] - Optional profile picture URL
 * @returns {Promise<Object>} - Returns the newly created user object
 */
exports.signup = async (username, email, password, profilePicture) => {
  try {
    // 1. Check if a user with the same email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error('Email or username is already in use');  // Custom error message for duplicate user
    }

    // 2. Hash the password using bcrypt with a salt round of 10 (you can adjust this for stronger security)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create a new user with the hashed password and other provided data
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: profilePicture || 'https://example.com/default-profile-pic.jpg',  // Default profile picture
    });

    // 4. Save the new user to the database and return the saved user object
    return await newUser.save();
  } catch (err) {
    // Log the error (optional: use Winston or any other logging mechanism)
    // logger.error('Error during signup: ', err.message);
    throw err;  // Re-throw the error to be handled by the calling function
  }
};

/**
 * User Login Service
 * @param {string} email - The email of the user attempting to log in
 * @param {string} password - The plain text password of the user attempting to log in
 * @returns {Promise<string|null>} - Returns the JWT token if successful, otherwise null
 */
exports.login = async (email, password) => {
  try {
    // 1. Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');  // Error if user is not found
    }

    // 2. Compare the provided password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');  // Error if passwords do not match
    }

    // 3. Generate a JWT token for the authenticated user
    const token = jwt.sign(
      { sub: user._id },  // The payload contains the user's unique ID
      process.env.JWT_SECRET,  // Use the JWT secret key stored in environment variables
      { expiresIn: '1h' }  // Set the token expiration time (1 hour in this case)
    );

    return token;  // Return the generated JWT token
  } catch (err) {
    // Log the error (optional: use Winston or any other logging mechanism)
    // logger.error('Error during login: ', err.message);
    throw err;  // Re-throw the error to be handled by the calling function
  }
};
