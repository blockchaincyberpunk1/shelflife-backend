const mongoose = require('mongoose');  // Import Mongoose to interact with MongoDB

/**
 * Define the schema for the "Book" model.
 * This schema represents a book document within the MongoDB database.
 * It includes fields like title, authors, genre, publication date, cover image URL, ISBN, tags, status, and personal notes.
 * It also includes embedded subdocuments for reviews and a virtual field for average ratings.
 */
const bookSchema = new mongoose.Schema({

  // Title: Required field to store the book's title.
  title: {
    type: String,  // The title of the book
    required: [true, 'Book title is required'],  // Custom error message if title is missing
    trim: true,  // Automatically trim leading/trailing whitespaces
    minlength: [2, 'Book title must be at least 2 characters long'],  // Minimum length validation
  },

  // Authors: Array of strings representing one or more authors of the book.
  authors: [{
    type: String,  // Each author's name stored as a string
    required: [true, 'At least one author is required'],  // Custom error if no author is provided
    trim: true  // Automatically trim whitespace from author names
  }],

  // Genre: Optional string field to store the book's genre.
  genre: {
    type: String,  // Genre of the book
    trim: true  // Trim leading/trailing whitespaces for cleanliness
  },

  // Publication Date: Optional field to store the book's publication date.
  publicationDate: {
    type: Date,  // Date of publication
    default: null  // Default value if no date is provided
  },

  // Cover Image URL: Optional string to store the URL of the book's cover image with validation.
  coverImageUrl: {
    type: String,  // URL for the cover image
    validate: {
      validator: function (v) {
        // URL validation for common image file formats
        return v ? /^https?:\/\/.*\.(jpeg|jpg|png|gif|webp)$/.test(v) : true;
      },
      message: props => `${props.value} is not a valid image URL!`  // Error message for invalid URLs
    },
    // Default cover image if none is provided
    default: 'https://images.pexels.com/photos/1148399/pexels-photo-1148399.jpeg'
  },

  // ISBN: Optional string field to store the book's International Standard Book Number.
  isbn: {
    type: String,  // ISBN stored as a string
    unique: true,  // Enforce uniqueness in the database for ISBN numbers
    trim: true,  // Automatically remove leading/trailing whitespaces
    sparse: true,  // Allow some books without ISBNs while enforcing uniqueness
    validate: {
      validator: function (v) {
        // Basic ISBN validation (does not enforce checksum)
        return v ? /^(97(8|9))?\d{9}(\d|X)$/.test(v) : true;
      },
      message: props => `${props.value} is not a valid ISBN number!`  // Custom error message for invalid ISBNs
    }
  },

  // Tags: Optional array of strings for metadata like book tags or categories.
  tags: [{
    type: String,  // Each tag stored as a string
    trim: true  // Trim whitespace
  }],

  // Personal Notes: Optional field for user's personal notes or comments about the book.
  personalNotes: {
    type: String,  // Store notes as a string
    trim: true,  // Automatically remove whitespace
    maxlength: [2000, 'Personal notes cannot exceed 2000 characters']  // Max length validation for the notes
  },

  // Status: Enum field to store the current reading status of the book.
  // Options include "Read", "Currently Reading", and "Want to Read".
  status: {
    type: String,  // Reading status stored as a string
    enum: ['Read', 'Currently Reading', 'Want to Read'],  // Restrict to valid status values
    default: 'Want to Read'  // Default status if not provided
  },

  // Reviews: Array of subdocuments to store user reviews for the book.
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,  // Reference to the user who wrote the review
      ref: 'User',  // Reference to the User model
      required: true
    },
    rating: {
      type: Number,  // Rating given by the user
      min: 1,  // Minimum rating
      max: 5,  // Maximum rating
      required: true
    },
    comment: {
      type: String,  // Comment or review provided by the user
      trim: true,  // Trim leading/trailing whitespaces
      maxlength: [1000, 'Review cannot exceed 1000 characters']  // Max length validation
    },
    createdAt: {
      type: Date,  // Timestamp when the review was created
      default: Date.now  // Automatically set to current date/time when the review is created
    }
  }],

  // Shelf: Optional reference to the "Shelf" model.
  shelf: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to the shelf
    ref: 'Shelf',  // Reference to the "Shelf" model
    default: null  // Default to null if the book is not assigned to any shelf
  }

}, { timestamps: true });  // Automatically add createdAt and updatedAt timestamps

/**
 * Virtual property to compute the average rating for the book based on the reviews.
 */
bookSchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) {
    return 0;  // If there are no reviews, return an average rating of 0
  }
  
  // Compute the average rating from the ratings in the reviews array
  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return sum / this.reviews.length;
});

/**
 * Virtual property to get a formatted string of the authors.
 * This property does not persist in the database but provides a computed value when accessed.
 */
bookSchema.virtual('authorList').get(function () {
  return this.authors.join(', ');  // Join all author names with commas
});

/**
 * Export the Book model to be used in the application.
 * The schema includes validation for fields like title, authors, ISBN, and URLs, along with support for book reviews.
 */
module.exports = mongoose.model('Book', bookSchema);  // Export the "Book" model for use in the application
