const Book = require('../models/Book');  // Import the Book model to interact with the 'books' collection in MongoDB

/**
 * Fetch all books from the database
 * @returns {Promise<Array>} - A promise that resolves to an array of books
 */
exports.getAllBooks = async () => {
  try {
    // Fetch all books and populate the 'shelf' field with the corresponding shelf data
    const books = await Book.find().populate('shelf'); // Populate adds the related shelf data
    return books; // Return the array of books
  } catch (err) {
    // Log the error and throw it for handling by the controller or caller
    logger.error(`Error fetching all books: ${err.message}`);
    throw new Error('Could not fetch books. Please try again later.');
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
    const books = await Book.find({ shelf: shelfId }).populate('shelf'); // Find books by shelf ID and populate the shelf field
    return books; // Return the books on the specified shelf
  } catch (err) {
    // Log the error and throw it for handling by the controller or caller
    logger.error(`Error fetching books by shelf ID ${shelfId}: ${err.message}`);
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
      { shelf: newShelfId }, // Update the shelf field with the new shelf ID
      { new: true }  // Return the updated document instead of the original one
    ).populate('shelf'); // Populate the shelf data

    if (!updatedBook) {
      throw new Error('Book not found.'); // If no book is found with the provided ID, throw an error
    }

    return updatedBook; // Return the updated book document
  } catch (err) {
    // Log the error and throw it for handling by the controller or caller
    logger.error(`Error updating book shelf for book ID ${bookId}: ${err.message}`);
    throw new Error('Could not update the book shelf.');
  }
};

/**
 * Create a new book in the database
 * @param {Object} bookData - The data for the new book (title, authors, coverImageUrl, etc.)
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
    // Log the error and throw it for handling by the controller or caller
    logger.error(`Error creating new book: ${err.message}`);
    throw new Error('Could not create the book. Please try again.');
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
        { authors: { $in: [regex] } },       // Match any author (authors is an array)
      ],
    }).populate('shelf');  // Populate the 'shelf' field to include shelf details

    return books; // Return the array of books matching the search query
  } catch (err) {
    // Log the error and throw it for handling by the controller or caller
    logger.error(`Error searching books with query "${query}": ${err.message}`);
    throw new Error('Could not search for books. Please try again.');
  }
};
