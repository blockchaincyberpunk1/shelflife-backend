module.exports = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    
    // Set a default status code if none is provided
    const statusCode = err.statusCode || 500; 

    // Create a user-friendly error message
    let message = err.message || 'Internal Server Error';
    if (process.env.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Something went wrong. Please try again later.'; // Generic message for production
    }

    res.status(statusCode).json({ message }); 
};