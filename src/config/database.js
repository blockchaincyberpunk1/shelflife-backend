const mongoose = require('mongoose');   // Import Mongoose library for MongoDB connection

// Define an asynchronous function to connect to MongoDB
const connectDB = async () => {
    try {
        // Use mongoose.connect to establish a connection to the MongoDB database.
        // It takes the connection string (stored in MONGO_URI) and options as parameters.
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,  // Use new URL string parser to avoid deprecation warnings.
            useUnifiedTopology: true,   // Enables the new unified topology engine in Mongoose for server discovery and monitoring.
            useCreateIndex: true,   // Automatically create indexes for fields that have the unique or index property (avoids deprecation warnings).
            useFindAndModify: false,    // Use native `findOneAndUpdate()` instead of `findAndModify()` for updates (avoids deprecation warning).
        });

        // Log the host of the MongoDB server where the connection has been established.
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If an error occurs during the connection, log the error message and exit the process with status code 1 (failure).
        console.error(`Error:${error.message}`);
        process.exit(1);    // Exit the process to indicate failure if the connection cannot be established.
    }
};

// Export the connectDB function so it can be used in other parts of the application
module.exports = connectDB;
