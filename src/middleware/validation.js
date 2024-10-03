const { validationResult } = require("express-validator");

// Middleware to validate request input data and handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Format validation errors for better readability
    const formattedErrors = errors.array().map(error => ({
      field: error.param,
      message: error.msg
    }));

    // Return a 400 Bad Request with detailed validation errors
    return res.status(400).json({ errors: formattedErrors });
  }

  // If validation is successful, proceed to the next middleware or route handler
  next();
};

module.exports = { validate };
