const mongoose = require('mongoose');  // Import Mongoose for working with MongoDB

/**
 * Define the schema for the "Book" model.
 * This schema represents the structure of a book document in the MongoDB database.
 * The schema includes fields for the book's title, authors, cover image URL, and its association with a shelf.
 */
const bookSchema = new mongoose.Schema({
  
  // Title: Required string field to store the book's title with a minimum length of 2 characters.
  title: {
    type: String,  // String type to store the book's title
    required: [true, 'Book title is required'],  // Custom error message for missing title
    trim: true,  // Automatically remove any leading/trailing whitespace
    minlength: [2, 'Book title must be at least 2 characters long']  // Minimum length validation for the title
  },

  // Authors: An array of strings representing the names of the book's authors.
  authors: [{
    type: String,  // Each author is stored as a string
    required: [true, 'At least one author is required'],  // Custom error message if no author is provided
    trim: true  // Automatically remove whitespace from the author's name
  }],

  // Cover Image URL: Optional string to store the URL of the book's cover image.
  coverImageUrl: {
    type: String,  // URL for the book's cover image
    validate: {
      validator: function (v) {
        // If a URL is provided, ensure it follows a valid image URL format (jpeg, jpg, png, gif, webp)
        return v ? /^https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/.test(v) : true;
      },
      message: props => `${props.value} is not a valid image URL!`  // Custom error message for invalid URLs
    },
    // Default cover image URL if none is provided
    default: 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg'
  },

  // Shelf: A reference to the Shelf model (indicating which shelf the book belongs to).
  // If no shelf is provided, the book can be left unassigned (null).
  shelf: {
    type: mongoose.Schema.Types.ObjectId,  // ObjectId type to reference the Shelf model
    ref: 'Shelf',  // Reference to the "Shelf" model (foreign key relationship)
    default: null  // Default value is null, meaning the book may not be assigned to any shelf initially
  }

}, { timestamps: true });  // Automatically add `createdAt` and `updatedAt` timestamps to each book document

/**
 * Virtual property to get a formatted string of the authors.
 * This virtual property does not persist in the database but provides a computed value when accessed.
 * Example usage: book.authorList will return a comma-separated string of author names.
 */
bookSchema.virtual('authorList').get(function() {
  return this.authors.join(', ');  // Join all author names with a comma
});

/**
 * The Book model represents individual books in the "books" collection.
 * The schema is connected to the "Shelf" model, enabling book-shelf relationships.
 * The schema includes field validation to ensure proper formatting and mandatory fields are filled.
 */
module.exports = mongoose.model('Book', bookSchema);  // Export the "Book" model for use in other parts of the application
