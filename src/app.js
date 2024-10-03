const express = require('express');
const mongoose = require('mongoose');  // Import Mongoose for MongoDB interaction
const bodyParser = require('body-parser');  // Middleware for parsing incoming request bodies
const cors = require('cors');  // Enable Cross-Origin Resource Sharing
const helmet = require('helmet');  // Add security headers
const passport = require('passport');  // Import Passport for authentication
const logger = require('./utils/logger');  // Import custom logger (e.g., Winston)

// Import routes
const bookRoutes = require('./routes/books');
const shelfRoutes = require('./routes/shelves');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');  // Include user routes

const app = express();  // Initialize Express app

/** ------------------------
 *    MIDDLEWARE SETUP
 *  ------------------------ */

// Set security-related HTTP headers using Helmet
app.use(helmet());

// Parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Enable CORS to allow requests from other domains
app.use(cors());

// Initialize Passport for handling authentication strategies
app.use(passport.initialize());

/** ------------------------
 *    DATABASE CONNECTION
 *  ------------------------ */
const connectDB = require('./config/database');
connectDB();  // Establish connection to MongoDB

/** ------------------------
 *    ROUTE MOUNTING
 *  ------------------------ */

// Mount route handlers for various endpoints
app.use('/api/books', bookRoutes);  // Routes for book CRUD operations
app.use('/api/shelves', shelfRoutes);  // Routes for shelf CRUD operations
app.use('/api/auth', authRoutes);  // Routes for user authentication
app.use('/api/users', userRoutes);  // Routes for user management (profile, password reset, etc.)

/** ------------------------
 *    ERROR HANDLING
 *  ------------------------ */

// General error-handling middleware to capture all errors and return a response
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`, { stack: err.stack });  // Log error details with the stack trace

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',  // Send error message
    });
});

/** ------------------------
 *    EXPORT THE APP
 *  ------------------------ */
module.exports = app;  // Export the configured Express app
