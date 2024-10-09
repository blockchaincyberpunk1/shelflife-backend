const passport = require("passport"); // Import Passport for handling authentication strategies
const JwtStrategy = require("passport-jwt").Strategy; // Import JWT strategy from Passport
const ExtractJwt = require("passport-jwt").ExtractJwt; // Utility for extracting JWT tokens from requests
const User = require("../models/User"); // Import the User model to validate authenticated users
const logger = require("../utils/logger"); // Import Winston logger for logging important events

// Options for the JWT strategy: specifies how the token is extracted and the secret for verification
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the 'Authorization' header in 'Bearer' format
  secretOrKey: process.env.JWT_SECRET, // Secret key for verifying the token, stored in environment variables
  algorithms: ["HS256"], // Algorithm used for signing and verifying the token (e.g., HS256)
};

// JWT strategy implementation for Passport
passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // The JWT payload typically contains a 'sub' field, which is the user's ID
      const user = await User.findById(jwtPayload.sub); // Find the user by the ID in the token's payload

      if (!user) {
        // Log if the user is not found and return false to indicate authentication failure
        logger.warn(`Authentication failed: No user found for ID ${jwtPayload.sub}`);
        return done(null, false, { message: "User not found" });
      }

      // If user is found, pass the user object to Passport's 'done' callback to attach to the request object
      return done(null, user); // Successful authentication
    } catch (error) {
      // Log any error during the authentication process and pass it to the 'done' callback
      logger.error(`Error during authentication: ${error.message}`);
      return done(error, false); // Pass the error and indicate failure
    }
  })
);

// Initialize Passport to make it available across the app for handling JWT strategy
passport.initialize();

// Export Passport to be used in other parts of the application (e.g., middleware for protected routes)
module.exports = passport;
