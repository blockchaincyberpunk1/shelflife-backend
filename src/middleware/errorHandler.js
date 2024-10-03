const logger = require("../utils/logger");  // Use Winston logger for logging

// Centralized error handling middleware
module.exports = (err, req, res, next) => {
  // Log the error stack trace for debugging
  logger.error(err.stack);

  const statusCode = err.statusCode || 500;  // Default to 500 Internal Server Error

  // Handle Mongoose validation errors (e.g., validation failure in models)
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message, errors: err.errors });  // 400 Bad Request for validation errors
  }

  // Handle Mongoose "CastError" for invalid ObjectIds in queries
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }

  // Production-specific error handling
  let message = err.message || "Internal Server Error";
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Something went wrong. Please try again later.";
  }

  // Return the error response
  res.status(statusCode).json({ message });
};
