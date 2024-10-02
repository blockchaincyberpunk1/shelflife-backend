const mongoose = require('mongoose');  // Import Mongoose for MongoDB interaction

// Define the schema for the "Shelf" collection
const shelfSchema = new mongoose.Schema({
    // "userId" field to store the ID of the user who owns the shelf
    userId: {
        type: mongoose.Schema.Types.ObjectId,  // The field type is ObjectId, which refers to the ID of a document (in this case, the user)
        ref: 'User',  // This is a reference to the 'User' model, establishing a relationship with the User collection
        required: true  // This field is required, meaning each shelf must be associated with a user
    },
    
    // "name" field to store the name of the shelf
    name: {
        type: String,  // The type is a simple string, representing the shelf's name (e.g., "Favorites", "Wishlist", "Currently Reading")
        required: [true, 'Shelf name is required'],  // The name is mandatory for each shelf document
        trim: true,  // Remove unnecessary white spaces from the name
        minlength: [2, 'Shelf name must be at least 2 characters long'],  // Minimum length for shelf name
        maxlength: [50, 'Shelf name must be at most 50 characters long'],  // Maximum length for shelf name
        default: 'New Shelf'  // Optional: Default name if no name is provided
    },

    // "books" field is an array of book IDs that belong to this shelf
    books: [{
        type: mongoose.Schema.Types.ObjectId,  // Each book will be referenced by its ObjectId
        ref: 'Book',  // This sets up a reference to the 'Book' model, indicating that each element in the array is a book
    }],
    
}, { timestamps: true });  // Automatically manage createdAt and updatedAt fields

// Pre-save hook to prevent adding duplicate books to the shelf
shelfSchema.pre('validate', function(next) {
    const uniqueBooks = [...new Set(this.books.map(book => book.toString()))];  // Ensure books array contains unique ObjectId references
    if (uniqueBooks.length !== this.books.length) {
        return next(new Error('Duplicate books are not allowed on the same shelf.'));
    }
    next();
});

// Export the "Shelf" model, allowing it to be used for creating and managing shelves in the database
module.exports = mongoose.model('Shelf', shelfSchema);

