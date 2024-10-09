const passport = require("passport");
const logger = require("../utils/logger"); // Import Winston logger for logging

/**
 * Middleware to protect routes that require authentication using JWT.
 * This middleware intercepts requests to protected routes, ensures that the user is authenticated 
 * by verifying their JWT token, and handles cases where authentication fails. Additionally, it logs
 * authentication attempts and provides meaningful responses to unauthorized users.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function to call if authentication is successful.
 */
const authenticateJWT = (req, res, next) => {
  // Call the passport.authenticate method with the "jwt" strategy and session set to false 
  // (because we are not using session-based authentication, only token-based).
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    // Handle errors encountered during the authentication process
    if (err) {
      // Log the error using Winston for tracking purposes
      logger.error(`Authentication error: ${err.message}`);
      // Pass the error to the next middleware function (likely the error handler)
      return next(err);
    }

    // If no user is found or the token is invalid, handle the unauthorized access
    if (!user) {
      // Extract the reason for the failed authentication from Passport's "info" object
      // (e.g., "Token expired", "Invalid token", etc.). Default to "No user found" if info is unavailable.
      const reason = info?.message || "No user found";

      // Log a warning that an unauthorized access attempt was made
      logger.warn(`Unauthorized access attempt. Reason: ${reason}`);

      // Respond to the client with a 401 Unauthorized status code and a detailed message
      return res.status(401).json({
        message: "Unauthorized. Please log in.", // General message for the user
        error: reason, // Specific error reason (can help frontend display a more specific message)
      });
    }

    // If authentication is successful, log the event for monitoring purposes
    logger.info(`User ${user.email} authenticated successfully.`);

    // Attach the authenticated user object to the request object.
    // This makes the user's information available in subsequent middleware or route handlers.
    req.user = user;

    // Call the next middleware function in the stack (proceeds to the protected route)
    next();
  })(req, res, next); // This syntax immediately invokes the authentication function
};

/**
 * Export the `authenticateJWT` middleware so it can be used in other parts of the application
 * to protect routes and ensure only authenticated users can access them.
 */
module.exports = { authenticateJWT };
