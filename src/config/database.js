const mongoose = require('mongoose'); // Import Mongoose for MongoDB connection
const logger = require('../utils/logger'); // Import custom Winston logger for logging

/**
 * Function to connect to the MongoDB database
 * Uses the MONGO_URI from environment variables to establish the connection.
 * On failure, it logs the error and exits the process to indicate failure.
 */
const connectDB = async () => {
    try {
        // Ensure the MONGO_URI environment variable is defined before attempting the connection
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // Connect to the MongoDB database using Mongoose
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true, // Use new URL string parser to avoid deprecation warnings
            useUnifiedTopology: true, // Enable the new unified topology for server discovery and monitoring
        });

        // Log success message with details of the connected MongoDB host
        logger.info(`MongoDB connected successfully: ${conn.connection.host}`);
    } catch (error) {
        // If connection fails, log the error and exit the process
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit with failure code if unable to connect
    }
};

// Export the connectDB function to allow it to be used throughout the app
module.exports = connectDB;
