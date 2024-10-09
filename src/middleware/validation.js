const { validationResult } = require("express-validator"); // Import express-validator to handle request input validation

/**
 * Middleware to validate request input data.
 * It checks the validation results set up by express-validator on the request.
 * If errors are found, it returns a detailed list of validation errors to the client.
 * Otherwise, it proceeds to the next middleware or route handler.
 *
 * @param {Object} req - The HTTP request object, where input data is validated.
 * @param {Object} res - The HTTP response object used to send validation error responses.
 * @param {Function} next - The next middleware or route handler in the Express stack.
 */
const validate = (req, res, next) => {
  // Extract validation errors from the request using validationResult from express-validator
  const errors = validationResult(req);

  // If validation errors are found (i.e., the request data is invalid):
  if (!errors.isEmpty()) {
    // Format the errors to make them easier to understand.
    // Each error includes the field that failed validation and the corresponding error message.
    const formattedErrors = errors.array().map(error => ({
      field: error.param, // The field that caused the validation error
      message: error.msg, // The error message related to that field
    }));

    // Log the validation errors (optional: use Winston or another logging system)
    // This can help with debugging during development or in production environments
    // logger.warn(`Validation failed: ${JSON.stringify(formattedErrors)}`);

    // Send a 400 Bad Request response with the formatted validation errors.
    // This status code indicates that the client sent invalid or incomplete data.
    return res.status(400).json({
      message: "Validation failed. Please check the input data.", // A general message for the client
      errors: formattedErrors, // The detailed list of validation errors
    });
  }

  // If no validation errors are found, proceed to the next middleware or route handler.
  next();
};

module.exports = { validate };
