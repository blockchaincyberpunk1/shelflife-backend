const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction

// Define a new schema for the "Shelf" collection
const shelfSchema = new mongoose.Schema({
    // "userId" field to store the ID of the user who owns the shelf
    userId: { 
        type: mongoose.Schema.Types.ObjectId,  // The field type is ObjectId, which refers to the ID of a document (in this case, the user)
        ref: 'User',    // This is a reference to the 'User' model, establishing a relationship with the User collection
        required: true  // This field is required, meaning each shelf must be associated with a user
    },
    
    // "name" field to store the name of the shelf
    name: { 
        type: String,   // The type is a simple string, representing the shelf's name (e.g., "Favorites", "Wishlist", "Currently Reading")
        required: true  // The name is mandatory for each shelf document
    },
    
    // "books" field is an array of book IDs that belong to this shelf
    books: [{
        type: mongoose.Schema.Types.ObjectId,  // Each book will be referenced by its ObjectId
        ref: 'Book'                            // This sets up a reference to the 'Book' model, indicating that each element in the array is a book
        // The 'books' array will store multiple references (ObjectIds) to books that belong to this shelf
    }]
});

// Export the "Shelf" model, allowing it to be used for creating and managing shelves in the database
module.exports = mongoose.model('Shelf', shelfSchema);
