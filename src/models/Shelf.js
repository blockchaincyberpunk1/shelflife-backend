const mongoose = require('mongoose');  // Import Mongoose for MongoDB interaction

/**
 * Define the schema for the "Shelf" collection.
 * A shelf is associated with a user and can hold multiple books.
 * The schema includes fields for the user ID, shelf name, and an array of book references.
 */
const shelfSchema = new mongoose.Schema({
  
  // userId: Required field to store the ID of the user who owns the shelf.
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // ObjectId type to refer to the User model
    ref: 'User',  // Establishes a relationship with the "User" model
    required: true  // A shelf must be associated with a specific user
  },
  
  // name: String field for the name of the shelf (e.g., "Favorites", "To Read").
  name: {
    type: String,  // Shelf name is a string
    required: [true, 'Shelf name is required'],  // Custom error message if no name is provided
    trim: true,  // Automatically remove unnecessary whitespaces
    minlength: [2, 'Shelf name must be at least 2 characters long'],  // Minimum length validation for shelf name
    maxlength: [50, 'Shelf name must be at most 50 characters long'],  // Maximum length validation for shelf name
    default: 'New Shelf'  // If no name is provided, default to "New Shelf"
  },

  // books: Array of ObjectIds representing books on the shelf.
  // Each book in the array references the "Book" model.
  books: [{
    type: mongoose.Schema.Types.ObjectId,  // Each book is represented by an ObjectId
    ref: 'Book',  // Establishes a relationship with the "Book" model
  }],
  
}, { timestamps: true });  // Automatically manage createdAt and updatedAt fields

/**
 * Pre-save hook to prevent adding duplicate books to a shelf.
 * This hook checks that the 'books' array contains unique ObjectId references before saving.
 */
shelfSchema.pre('validate', function(next) {
  // Create a Set from the books array to ensure all books are unique
  const uniqueBooks = [...new Set(this.books.map(book => book.toString()))];
  
  // If the number of unique books is not equal to the length of the books array, there are duplicates
  if (uniqueBooks.length !== this.books.length) {
    return next(new Error('Duplicate books are not allowed on the same shelf.'));  // Custom error for duplicate books
  }

  next();  // Proceed with saving if there are no duplicates
});

/**
 * Export the "Shelf" model.
 * The model is used to create, manage, and query shelf documents in the MongoDB database.
 * The schema is linked to the "User" model (who owns the shelf) and the "Book" model (books on the shelf).
 */
module.exports = mongoose.model('Shelf', shelfSchema);
