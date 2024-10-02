const mongoose = require('mongoose');   // Import Mongoose library for MongoDB connection
const logger = require('../utils/logger');  // Import the custom Winston logger


// Define an asynchronous function to connect to MongoDB
const connectDB = async () => {
    try {
        // Ensure MONGO_URI is set in the environment variables
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // Use mongoose.connect to establish a connection to the MongoDB database.
        // It takes the connection string (stored in MONGO_URI) and options as parameters.
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,  // Use new URL string parser to avoid deprecation warnings.
            useUnifiedTopology: true,   // Enables the new unified topology engine in Mongoose for server discovery and monitoring.
        });

        // Log a success message with the host of the MongoDB server
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log the error using Winston, and exit the process if the connection fails
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);   // Exit the process to indicate failure if the connection cannot be established.
    }
};

// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;
