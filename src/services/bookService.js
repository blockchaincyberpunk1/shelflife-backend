const Book = require('../models/Book');  // Import the Book model to interact with the 'books' collection in MongoDB

/**
 * Fetch all books from the database
 * @returns {Promise<Array>} - A promise that resolves to an array of books
 */
exports.getAllBooks = async () => {
  try {
    // Fetch all books and populate the 'shelf' field with the corresponding shelf data
    const books = await Book.find().populate('shelf');  // Populate the related shelf data
    return books;  // Return the array of books
  } catch (err) {
    throw new Error('Could not fetch books. Please try again later.');  // Handle errors
  }
};

/**
 * Fetch a single book by its ID
 * @param {string} bookId - The ID of the book to retrieve
 * @returns {Promise<Object>} - A promise that resolves to the book document
 */
exports.getBookById = async (bookId) => {
  try {
    // Fetch the book by its ID and populate the shelf field
    const book = await Book.findById(bookId).populate('shelf');
    if (!book) {
      throw new Error('Book not found.');  // If no book is found, throw an error
    }
    return book;  // Return the found book document
  } catch (err) {
    throw new Error('Could not retrieve the book. Please try again later.');
  }
};

/**
 * Fetch books by shelf ID
 * @param {string} shelfId - The ID of the shelf to filter books by
 * @returns {Promise<Array>} - A promise that resolves to an array of books that belong to the specified shelf
 */
exports.getBooksByShelf = async (shelfId) => {
  try {
    // Fetch books where the 'shelf' field matches the provided shelfId
    const books = await Book.find({ shelf: shelfId }).populate('shelf');
    return books;  // Return the books on the specified shelf
  } catch (err) {
    throw new Error('Could not fetch books for the specified shelf.');
  }
};

/**
 * Update a book's shelf
 * @param {string} bookId - The ID of the book to update
 * @param {string} newShelfId - The ID of the new shelf to assign to the book
 * @returns {Promise<Object>} - A promise that resolves to the updated book document
 */
exports.updateBookShelf = async (bookId, newShelfId) => {
  try {
    // Find the book by its ID and update its 'shelf' field to the new shelf ID
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { shelf: newShelfId },  // Update the shelf field with the new shelf ID
      { new: true }  // Return the updated document instead of the original one
    ).populate('shelf');  // Populate the shelf data

    if (!updatedBook) {
      throw new Error('Book not found.');  // If no book is found, throw an error
    }

    return updatedBook;  // Return the updated book document
  } catch (err) {
    throw new Error('Could not update the book shelf.');
  }
};

/**
 * Create a new book in the database
 * @param {Object} bookData - The data for the new book (title, authors, genre, etc.)
 * @returns {Promise<Object>} - A promise that resolves to the newly created book document
 */
exports.createBook = async (bookData) => {
  try {
    // Create a new book instance using the provided data (title, authors, etc.)
    const newBook = new Book(bookData);

    // Save the book document to the database and return the newly created book
    await newBook.save();
    return newBook;
  } catch (err) {
    throw new Error('Could not create the book. Please try again.');
  }
};

/**
 * Update an existing book in the database
 * @param {string} bookId - The ID of the book to update
 * @param {Object} updatedData - The updated data for the book (e.g., title, authors, status)
 * @returns {Promise<Object>} - A promise that resolves to the updated book document
 */
exports.updateBook = async (bookId, updatedData) => {
  try {
    // Find the book by its ID and update it with the provided data
    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updatedData,  // Update the book's fields
      { new: true }  // Return the updated document
    ).populate('shelf');  // Populate the shelf field

    if (!updatedBook) {
      throw new Error('Book not found.');  // If no book is found, throw an error
    }

    return updatedBook;  // Return the updated book document
  } catch (err) {
    throw new Error('Could not update the book. Please try again.');
  }
};

/**
 * Delete a book from the database
 * @param {string} bookId - The ID of the book to delete
 * @returns {Promise<Object>} - A promise that resolves to the deleted book document
 */
exports.deleteBook = async (bookId) => {
  try {
    // Find the book by its ID and delete it from the database
    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      throw new Error('Book not found.');  // If no book is found with the provided ID, throw an error
    }

    return deletedBook;  // Return the deleted book document
  } catch (err) {
    throw new Error('Could not delete the book. Please try again.');
  }
};

/**
 * Search for books by title or author
 * The search is case-insensitive and uses regular expressions for partial matching
 * @param {string} query - The search query (part of the title or author name)
 * @returns {Promise<Array>} - A promise that resolves to an array of books matching the search query
 */
exports.searchBooks = async (query) => {
  try {
    // Create a case-insensitive regular expression based on the search query
    const regex = new RegExp(query, 'i');  // 'i' flag makes the search case-insensitive

    // Search for books where the title or authors match the query
    const books = await Book.find({
      $or: [
        { title: { $regex: regex } },        // Match books by title
        { authors: { $regex: regex } },      // Match any author
      ],
    }).populate('shelf');  // Populate the 'shelf' field to include shelf details

    return books;  // Return the array of books matching the search query
  } catch (err) {
    throw new Error('Could not search for books. Please try again.');
  }
};

/**
 * Add a review for a book
 * @param {string} bookId - The ID of the book to review
 * @param {Object} reviewData - The review data (rating, comment, etc.)
 * @returns {Promise<Object>} - A promise that resolves to the updated book document with the review
 */
exports.addReview = async (bookId, reviewData) => {
  try {
    // Find the book by its ID and add the review to its reviews array
    const book = await Book.findById(bookId);
    if (!book) {
      throw new Error('Book not found.');
    }
    
    // Add the review to the book's reviews array
    book.reviews.push(reviewData);
    await book.save();  // Save the updated book

    return book;  // Return the updated book with the new review
  } catch (err) {
    throw new Error('Could not add the review. Please try again.');
  }
};
