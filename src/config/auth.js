const passport = require('passport');   // Import Passport library for authentication
const JwtStrategy = require('passport-jwt').Strategy;   // Import the JWT strategy from Passport
const ExtractJwt = require('passport-jwt').ExtractJwt;  // Import utility for extracting JWT tokens
const User = require('../models/User');  // Import the User model

// Options object to configure the JWT strategy
const opts = {};

// Specify how to extract the JWT from the request
// In this case, I use the Authorization header with a 'Bearer' token format 
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

// Secret or key to verify the JWT signature
// This should match the secret/key used when signing the JWT
opts.secretOrKey = process.env.JWT_SECRET;

// Define the JWT strategy for Passport 
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
        // The JWT payload typically contains information like the user's ID in 'sub' (subject)
        // Use the 'sub' field from the payload to find the user in the database
        const user = await User.findById(jwt_payload.sub);

        // If user is found, pass the user object to Passport's 'done' callback to attach it to the request
        if (user) {
            return done(null, user);    // Successfully authenticated the user
        } else {
            // If no user is found, return false to indicate authentication failure
            return done(null, false);
        }
    } catch (error) {
        // If an error occurs (e.g., database issue), pass the error to Passport's 'done' callback
        return done(error, false);
    }

}));

// Export the configured Passport module to be used in other parts of the app
module.exports = passport;

