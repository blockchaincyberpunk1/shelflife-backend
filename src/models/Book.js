const mongoose = require('mongoose');  // Import Mongoose for working with MongoDB

// Define the schema for the "Book" model
const bookSchema = new mongoose.Schema({
    // "title" field to store the book's title
    title: {
        type: String,   // The type of data is a string
        required: [true, 'Book title is required'],  // Custom error message for validation
        trim: true,  // Trim white spaces from the title
        minlength: [2, 'Book title must be at least 2 characters long']  // Add a minimum length for the title
    },

    // "authors" field to store an array of authors' names
    authors: [{
        type: String,   // Each author will be a string value
        required: [true, 'At least one author is required'],  // Custom error message
        trim: true  // Trim white spaces from author names
    }],

    // "coverImageUrl" field to store the URL of the book's cover image
    coverImageUrl: {
        type: String,   // Optional field for storing URL
        validate: {
            validator: function(v) {
                return v ? /^https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/.test(v) : true;  // Validate URL format if provided
            },
            message: props => `${props.value} is not a valid image URL!`
        },
        default: 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg'  // Default cover image URL if none is provided
    },

    // "shelf" field to store a reference to the specific shelf this book is assigned to
    shelf: {
        type: mongoose.Schema.Types.ObjectId,  // This defines the field as an ObjectId
        ref: 'Shelf',  // Reference to the "Shelf" model
        default: null  // By default, the book may not be assigned to any shelf
    }
}, { timestamps: true });  // Automatically manage createdAt and updatedAt fields

// Virtual property to get a formatted string of the authors
bookSchema.virtual('authorList').get(function() {
    return this.authors.join(', ');  // Returns authors as a comma-separated string
});

// Export the "Book" model to be used in other parts of the application
// This model will interact with the "books" collection in MongoDB
module.exports = mongoose.model('Book', bookSchema);
