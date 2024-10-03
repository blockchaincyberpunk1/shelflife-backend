const passport = require("passport");
const logger = require("../utils/logger");  // Use Winston logger for better logging

// Middleware to protect routes that require authentication using JWT
const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      // Log any errors encountered during authentication
      logger.error(`Authentication error: ${err.message}`);
      return next(err);  // Pass error to the next middleware (error handler)
    }

    if (!user) {
      // Log the failed authentication attempt
      logger.warn(`Unauthorized access attempt. Reason: ${info?.message || "No user found"}`);
      return res.status(401).json({ message: "Unauthorized" });  // 401 Unauthorized
    }

    // Attach the user object to the request object for downstream middleware or route handlers
    req.user = user;
    next();  // Authentication successful, move to the next middleware or route handler
  })(req, res, next);
};

module.exports = { authenticateJWT };
