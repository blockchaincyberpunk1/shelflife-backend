const Book = require('../models/Book');  // Import the Book model
const bookService = require('../services/bookService');  // Import the book service containing business logic
const logger = require('../utils/logger');  // Import Winston logger for logging

/**
 * Fetch all books
 * This controller retrieves all books from the database
 */
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();  // Call the service to fetch all books
    res.json({
      message: 'Books retrieved successfully',
      data: books
    });
    logger.info('Fetched all books');
  } catch (err) {
    logger.error('Error fetching books', { error: err.message });
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Fetch books by shelf
 * This controller retrieves books that belong to a specific shelf
 */
exports.getBooksByShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.shelfId;  // Get the shelfId from the URL parameters
    if (!shelfId) {
      return res.status(400).json({ message: 'Shelf ID is required' });
    }
    
    const books = await bookService.getBooksByShelf(shelfId);  // Call the service to fetch books by shelf ID
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found for the specified shelf' });
    }

    res.json({
      message: `Books retrieved for shelf ${shelfId}`,
      data: books
    });
    logger.info(`Fetched books for shelf ${shelfId}`);
  } catch (err) {
    logger.error(`Error fetching books for shelf ${req.params.shelfId}`, { error: err.message });
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Update the shelf a book belongs to
 * This controller updates the shelf association for a book
 */
exports.updateBookShelf = async (req, res, next) => {
  try {
    const bookId = req.params.id;  // Get the bookId from the URL parameters
    const newShelfId = req.body.shelf;  // Get the new shelf ID from the request body

    if (!bookId || !newShelfId) {
      return res.status(400).json({ message: 'Book ID and Shelf ID are required' });
    }

    const updatedBook = await bookService.updateBookShelf(bookId, newShelfId);  // Call the service to update the book's shelf
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({
      message: 'Book shelf updated successfully',
      data: updatedBook
    });
    logger.info(`Updated book ${bookId} to shelf ${newShelfId}`);
  } catch (err) {
    logger.error(`Error updating book ${req.params.id} to shelf`, { error: err.message });
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Create a new book
 * This controller creates a new book and stores it in the database
 */
exports.createBook = async (req, res, next) => {
  try {
    const newBookData = req.body;  // Get the new book data from the request body

    // Input validation
    if (!newBookData.title || !newBookData.authors || newBookData.authors.length === 0) {
      return res.status(400).json({ message: 'Title and authors are required' });
    }

    const newBook = await bookService.createBook(newBookData);  // Call the service to create a new book
    res.status(201).json({
      message: 'Book created successfully',
      data: newBook
    });
    logger.info(`New book created: ${newBook._id}`);
  } catch (err) {
    logger.error('Error creating book', { error: err.message });
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Search for books by title or author
 * This controller searches books based on query parameters
 */
exports.searchBooks = async (req, res, next) => {
  try {
    const query = req.query.q;  // Get the search query from the query string (URL parameters)
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const books = await bookService.searchBooks(query);  // Call the service to search books by title or author
    if (books.length === 0) {
      return res.status(404).json({ message: 'No books found matching the search query' });
    }

    res.json({
      message: `Books matching query "${query}" retrieved`,
      data: books
    });
    logger.info(`Searched books with query "${query}"`);
  } catch (err) {
    logger.error(`Error searching books with query "${req.query.q}"`, { error: err.message });
    next(err);  // Pass the error to the error-handling middleware
  }
};
