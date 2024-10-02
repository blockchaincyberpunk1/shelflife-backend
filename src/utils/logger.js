const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;
const path = require('path');

// Define a custom format for the logs
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

// Create a Winston logger instance
const logger = createLogger({
    level: 'info',  // Log level can be changed depending on the environment (info, error, debug, etc.)
    format: combine(
        timestamp(),
        customFormat  // Use the custom log format defined above
    ),
    transports: [
        // Console transport for logging to the console (especially useful in development)
        new transports.Console({
            format: combine(
                colorize(),  // Add color to console logs for better readability
                customFormat
            )
        }),

        // File transport for logging errors to a file (useful for production)
        new transports.File({
            filename: path.join(__dirname, '../../logs/error.log'),  // Log errors to this file
            level: 'error'  // Only log error level messages to this file
        })
    ]
});

// Export the logger instance to use in other parts of the application
module.exports = logger;
