const bcrypt = require("bcrypt"); // Import bcrypt for password hashing and comparison
const jwt = require("jsonwebtoken"); // Import jsonwebtoken for token creation
const { validationResult } = require("express-validator"); // Import validation result from express-validator
const authService = require("../services/authService"); // Import auth service layer
const logger = require("../utils/logger"); // Import Winston logger for logging

/**
 * User Signup Controller
 * Handles the registration of new users
 */
exports.signup = async (req, res, next) => {
  try {
    // 1. Validate the incoming request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Signup validation failed", { errors: errors.array() }); // Log validation failures
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    // 2. Extract necessary data from the request body
    const { username, email, password, profilePicture } = req.body;

    // 3. Call the signup service to create a new user
    const newUser = await authService.signup(
      username,
      email,
      password,
      profilePicture
    );

    // 4. Send back the success response with the newly created user
    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });

    logger.info(`User created successfully: ${newUser._id}`); // Log successful signup
  } catch (err) {
    logger.error("Error during signup", { error: err.message }); // Log any unexpected errors
    next(err); // Pass errors to the global error handler middleware
  }
};

/**
 * User Login Controller
 * Handles the login process and JWT issuance
 */
exports.login = async (req, res, next) => {
  try {
    // 1. Validate the incoming request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Login validation failed", { errors: errors.array() }); // Log validation failures
      return res.status(400).json({ errors: errors.array() }); // Return validation errors
    }

    // 2. Extract email and password from the request body
    const { email, password } = req.body;

    // 3. Attempt login via the authService
    const token = await authService.login(email, password);

    // 4. Check if login was successful and a JWT token was issued
    if (token) {
      res.json({
        message: "Login successful",
        token, // Send the JWT token back to the client
        expiresIn: process.env.JWT_EXPIRES_IN || "1h", // Optional: Include token expiry time in the response
      });

      logger.info(`User logged in: ${email}`); // Log successful login
    } else {
      logger.warn(`Failed login attempt: Invalid credentials for ${email}`); // Log failed login attempt
      res.status(401).json({ message: "Invalid credentials" }); // 401 Unauthorized for invalid credentials
    }
  } catch (err) {
    logger.error("Error during login", { error: err.message }); // Log any unexpected errors
    next(err); // Pass errors to the global error handler middleware
  }
};
