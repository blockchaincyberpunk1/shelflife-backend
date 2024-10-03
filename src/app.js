const express = require('express'); // Import Express for building the web server
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const bodyParser = require('body-parser'); // Middleware for parsing incoming JSON request bodies
const cors = require('cors'); // Middleware to allow Cross-Origin Resource Sharing (for handling requests from different origins)
const helmet = require('helmet'); // Middleware to set various HTTP headers for security
const passport = require('passport'); // Import Passport for authentication strategies (JWT, etc.)
const rateLimit = require('express-rate-limit'); // Import rate-limiting middleware to prevent abuse of API routes
const logger = require('./utils/logger'); // Import custom logger (e.g., Winston) for logging system events

// Import route files for different parts of the app
const bookRoutes = require('./routes/books'); // Book-related routes
const shelfRoutes = require('./routes/shelves'); // Shelf-related routes
const authRoutes = require('./routes/auth'); // Authentication-related routes (login, signup)
const userRoutes = require('./routes/users'); // User-related routes (profile, password management)

// Initialize Express app
const app = express(); 

/** ------------------------
 *    MIDDLEWARE SETUP
 *  ------------------------ */

// Helmet: Secure the app by setting various HTTP headers
app.use(helmet());

// Body-parser: Parse incoming request bodies in JSON format (for easier handling of requests)
app.use(bodyParser.json());

// CORS: Allow requests from different domains (by default, browsers block requests from different origins)
app.use(cors());

// Passport: Initialize Passport to handle authentication strategies (like JWT)
app.use(passport.initialize());

/** ------------------------
 *    RATE LIMITING FOR SECURITY
 *  ------------------------ */

// Limit the number of requests to authentication routes (prevent abuse or brute-force attacks)
// This allows 100 requests per IP every 15 minutes for /api/auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many login attempts from this IP, please try again later.', // Message sent when rate limit is exceeded
});

// Apply the rate limiter only to authentication routes (signup, login)
app.use('/api/auth', authLimiter); 

/** ------------------------
 *    DATABASE CONNECTION
 *  ------------------------ */

const connectDB = require('./config/database'); // Import the MongoDB connection logic
connectDB(); // Connect to the MongoDB database

/** ------------------------
 *    ROUTE MOUNTING
 *  ------------------------ */

// Mount the book-related routes to /api/books (handles CRUD operations for books)
app.use('/api/books', bookRoutes);

// Mount the shelf-related routes to /api/shelves (handles CRUD operations for shelves)
app.use('/api/shelves', shelfRoutes);

// Mount the authentication routes to /api/auth (handles user login, signup, etc.)
app.use('/api/auth', authRoutes);

// Mount the user-related routes to /api/users (handles user profile management, password updates, etc.)
app.use('/api/users', userRoutes);

/** ------------------------
 *    ERROR HANDLING
 *  ------------------------ */

// General error-handling middleware to capture all errors and return a response
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const statusCode = err.status || 500;

  let message = err.message || "Internal Server Error";

  // Hide stack traces in production
  if (process.env.NODE_ENV === "production" && statusCode === 500) {
    message = "Something went wrong. Please try again later.";
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

/** ------------------------
 *    EXPORT THE APP
 *  ------------------------ */

// Export the configured Express app so it can be imported and used in the server setup (server.js)
module.exports = app;