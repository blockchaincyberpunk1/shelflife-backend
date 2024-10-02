const passport = require("passport"); // Import Passport library for authentication
const JwtStrategy = require("passport-jwt").Strategy; // Import the JWT strategy from Passport
const ExtractJwt = require("passport-jwt").ExtractJwt; // Import utility for extracting JWT tokens
const User = require("../models/User"); // Import the User model
const logger = require("../utils/logger"); // Import Winston logger for logging

// JWT strategy options: defines how we extract the token and the secret for verifying the token
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header in 'Bearer' format
  secretOrKey: process.env.JWT_SECRET, // Secret or key for verifying the JWT signature (stored in environment variable)
  algorithms: ["HS256"], // Define which algorithms to use for JWT signing/verification (e.g., HS256)
};

// Define the JWT strategy for Passport
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // JWT payload typically contains a 'sub' field that holds the user's ID
      const user = await User.findById(jwtPayload.sub); // Find the user by ID in the JWT payload

      if (!user) {
        // If the user isn't found in the database, log the issue and return false
        logger.warn(
          `Authentication failed: User not found for ID ${jwtPayload.sub}`
        );
        return done(null, false, { message: "User not found" });
      }

      // If user is found, pass it to Passport's 'done' callback to attach the user object to the request
      return done(null, user); // Successful authentication
    } catch (error) {
      // If an error occurs (e.g., database issues), log the error and pass it to the 'done' callback
      logger.error(`Error during authentication: ${error.message}`);
      return done(error, false);
    }
  })
);

// Initialize Passport
passport.initialize();  // Initialize Passport to use its strategies

// Export the configured Passport module to be used in other parts of the app
module.exports = passport;
