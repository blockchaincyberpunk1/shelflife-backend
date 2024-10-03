const app = require("./app"); // Import the Express app configuration
const connectDB = require("./config/database"); // Import the database connection utility
const logger = require("./utils/logger"); // Import custom logger

const PORT = process.env.PORT || 5000; // Use port from environment or default to 5000

/**
 * Start the server after successfully connecting to the database.
 * If the connection fails, log the error and exit the process.
 */
const startServer = async () => {
  try {
    await connectDB(); // Connect to MongoDB

    // Start the Express server and listen on the defined port
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error(`Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit the process with failure code if DB connection fails
  }
};

if (process.env.NODE_ENV !== "production") {
  logger.info(`Starting server in ${process.env.NODE_ENV} mode...`);
}

startServer(); // Initialize the server
