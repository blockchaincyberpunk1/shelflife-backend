const bcrypt = require("bcrypt"); // Import bcrypt for password hashing and comparison
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token creation
const { validationResult } = require("express-validator"); // Import validation result from express-validator
const authService = require("../services/authService"); // Import auth service layer
const logger = require("../utils/logger"); // Import Winston logger for logging

/**
 * User Signup Controller
 * Handles the registration of new users
 * @param {Object} req - The request object containing user data (username, email, password, profilePicture)
 * @param {Object} res - The response object to send back to the client
 * @param {Function} next - The next middleware function in the Express stack
 */
exports.signup = async (req, res, next) => {
  try {
    // 1. Validate the incoming request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Signup validation failed", { errors: errors.array() }); // Log validation failures
      return res.status(400).json({ errors: errors.array() }); // Return validation errors to the client
    }

    // 2. Extract necessary data from the request body
    const { username, email, password, profilePicture } = req.body;

    // 3. Call the signup service to create a new user
    const newUser = await authService.signup(username, email, password, profilePicture);

    // 4. Send back a success response with the newly created user data
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

    // Log successful signup with the user ID
    logger.info(`User created successfully: ${newUser._id}`);
  } catch (err) {
    // Log any errors during signup
    logger.error("Error during signup", { error: err.message });
    // Pass the error to the global error handler middleware
    next(err);
  }
};

/**
 * User Login Controller
 * Handles the login process and issues a JWT token
 * @param {Object} req - The request object containing login credentials (email, password)
 * @param {Object} res - The response object to send back to the client
 * @param {Function} next - The next middleware function in the Express stack
 */
exports.login = async (req, res, next) => {
  try {
    // 1. Validate the incoming request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Login validation failed", { errors: errors.array() }); // Log validation failures
      return res.status(400).json({ errors: errors.array() }); // Return validation errors to the client
    }

    // 2. Extract email and password from the request body
    const { email, password } = req.body;

    // 3. Call the login service to authenticate the user and generate a JWT token
    const token = await authService.login(email, password);

    // 4. Check if login was successful and a JWT token was issued
    if (token) {
      res.json({
        message: "Login successful",
        token, // Send the JWT token back to the client
        expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Optional: Include token expiration time
      });

      // Log successful login
      logger.info(`User logged in: ${email}`);
    } else {
      // Log failed login attempt due to invalid credentials
      logger.warn(`Failed login attempt: Invalid credentials for ${email}`);
      res.status(401).json({ message: "Invalid credentials" }); // 401 Unauthorized for invalid credentials
    }
  } catch (err) {
    // Log any errors during login
    logger.error("Error during login", { error: err.message });
    // Pass the error to the global error handler middleware
    next(err);
  }
};
