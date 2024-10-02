const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport'); // Import Passport

// Import route files
const bookRoutes = require('./routes/books');
const shelfRoutes = require('./routes/shelves');
const authRoutes = require('./routes/auth'); // Import auth routes

const app = express();

// Middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize()); // Initialize Passport

// Database Connection 
const connectDB = require('./config/database'); 
connectDB(); 

// Mount routes 
app.use('/api/books', bookRoutes); 
app.use('/api/shelves', shelfRoutes);
app.use('/api/auth', authRoutes); // Mount auth routes

// Error handling middleware (add this after other middleware and routes)
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));