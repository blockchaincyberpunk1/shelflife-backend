const mongoose = require('mongoose'); // Import Mongoose for working with MongoDB

// Define the schema for the "Book" model
const bookSchema = new mongoose.Schema({
    // "title" field to store the book's title
    title: {
        type: String,   // The type of data is a string
        required: true, // This field is required, meaning it cannot be empty
    },

    // "authors" field to store an array of authors' names
    authors: [{
        type: String,   // Each author will be a string value
        required: true, // At least one author is required for each book
    }],

    // "coverImageUrl" field to store the URL of the book's cover image
    coverImageUrl: {
        type: String   // Optional field, can be left empty
    },

    // "shelf" field to store a reference to the specific shelf this book is assigned to
    shelf: {
        type: mongoose.Schema.Types.ObjectId,   // This defines the field as an ObjectId
        ref: 'Shelf',   // Reference to the "Shelf" model, linking the book to a shelf
        default: null   // By default, the book may not be assigned to any shelf
    }
});

// Export the "Book" model to be used in other parts of the application
// This model will interact with the "books" collection in MongoDB
module.exports = mongoose.model('Book', bookSchema);