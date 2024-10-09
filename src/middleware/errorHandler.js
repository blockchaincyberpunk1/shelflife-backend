const logger = require("../utils/logger"); // Import Winston logger for logging

/**
 * Centralized error-handling middleware for the application.
 * This middleware handles all errors thrown in the application, including validation and database errors,
 * and ensures consistent responses to the frontend with appropriate HTTP status codes and messages.
 */
module.exports = (err, req, res, next) => {
  // Log the error stack trace for debugging
  logger.error(err.stack);

  // Default to 500 Internal Server Error if no specific status code is set
  const statusCode = err.statusCode || 500;

  // Handle Mongoose validation errors (e.g., validation failure in models)
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
    });
  }

  // Handle Mongoose "CastError" (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Invalid ${err.path}: ${err.value}`, // Example: "Invalid _id: 12345"
    });
  }

  // Custom error handling for unauthorized access (401)
  if (statusCode === 401) {
    return res.status(401).json({
      message: "Unauthorized access. Please log in.",
    });
  }

  // Custom error handling for "not found" (404)
  if (statusCode === 404) {
    return res.status(404).json({
      message: "Resource not found.",
    });
  }

  // Generic error handling for production (500 Internal Server Error)
  let message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Something went wrong. Please try again later.";
  }

  // Return the error response with the appropriate status code and message
  return res.status(statusCode).json({
    message,
    // Optionally include the stack trace only in development mode for debugging
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};
