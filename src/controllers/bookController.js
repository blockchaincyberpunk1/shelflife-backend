const bookService = require('../services/bookService');  // Import the book service containing business logic
const logger = require('../utils/logger');  // Import the logger for logging events and errors

/**
 * Fetch all books
 * This controller retrieves all books from the database and sends them in the response.
 */
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await bookService.getAllBooks();  // Call the service to fetch all books
    logger.info('Fetched all books successfully');  // Log the success of fetching books
    res.json({
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (err) {
    logger.error('Error fetching books:', err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Fetch a book by its ID
 * This controller retrieves the details of a single book using its ID.
 * If no book is found, it returns a 404 error.
 */
exports.getBookById = async (req, res, next) => {
  try {
    const bookId = req.params.id;  // Get the book ID from the URL parameters
    const book = await bookService.getBookById(bookId);  // Call the service to fetch the book by ID

    logger.info(`Fetched book with ID: ${bookId}`);  // Log the success of fetching the book
    res.json({
      message: `Book ${bookId} retrieved successfully`,
      data: book
    });
  } catch (err) {
    logger.error(`Error fetching book with ID ${req.params.id}:`, err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Fetch books by shelf ID
 * This controller retrieves all books belonging to a specific shelf using the shelf ID.
 */
exports.getBooksByShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.shelfId;  // Get the shelf ID from the URL parameters
    const books = await bookService.getBooksByShelf(shelfId);  // Call the service to fetch books by shelf

    logger.info(`Fetched books for shelf ID: ${shelfId}`);  // Log the success of fetching books by shelf
    res.json({
      message: `Books retrieved for shelf ${shelfId}`,
      data: books
    });
  } catch (err) {
    logger.error(`Error fetching books for shelf ${req.params.shelfId}:`, err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Update the shelf of a book
 * This controller allows users to update the shelf a book belongs to by specifying a new shelf ID.
 */
exports.updateBookShelf = async (req, res, next) => {
  try {
    const bookId = req.params.id;  // Get the book ID from the URL parameters
    const newShelfId = req.body.shelf;  // Get the new shelf ID from the request body

    const updatedBook = await bookService.updateBookShelf(bookId, newShelfId);  // Call the service to update the shelf

    logger.info(`Updated book ${bookId} to shelf ${newShelfId}`);  // Log the success of updating the shelf
    res.json({
      message: `Book ${bookId} moved to shelf ${newShelfId}`,
      data: updatedBook
    });
  } catch (err) {
    logger.error(`Error updating shelf for book ID ${req.params.id}:`, err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Create a new book
 * This controller creates a new book in the database.
 * It validates the request body to ensure required fields like title and authors are present.
 */
exports.createBook = async (req, res, next) => {
  try {
    const newBookData = req.body;  // Get the new book data from the request body

    if (!newBookData.title || !newBookData.authors || newBookData.authors.length === 0) {
      logger.warn('Book creation failed: Title and authors are required');  // Log validation failure
      return res.status(400).json({ message: 'Title and authors are required' });  // Validate input
    }

    const newBook = await bookService.createBook(newBookData);  // Call the service to create a new book
    logger.info(`New book created with ID: ${newBook._id}`);  // Log the success of book creation
    res.status(201).json({
      message: 'Book created successfully',
      data: newBook
    });
  } catch (err) {
    logger.error('Error creating book:', err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Update book details
 * This controller allows users to update the details of an existing book.
 * It accepts updates like title, authors, genre, etc.
 */
exports.updateBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;  // Get the book ID from the URL parameters
    const updatedData = req.body;  // Get the updated book data from the request body

    const updatedBook = await bookService.updateBook(bookId, updatedData);  // Call the service to update the book
    logger.info(`Updated book with ID: ${bookId}`);  // Log the success of updating the book
    res.json({
      message: `Book ${bookId} updated successfully`,
      data: updatedBook
    });
  } catch (err) {
    logger.error(`Error updating book with ID ${req.params.id}:`, err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Delete a book
 * This controller allows users to delete a book from the database by its ID.
 */
exports.deleteBook = async (req, res, next) => {
  try {
    const bookId = req.params.id;  // Get the book ID from the URL parameters

    const deletedBook = await bookService.deleteBook(bookId);  // Call the service to delete the book
    logger.info(`Deleted book with ID: ${bookId}`);  // Log the success of deleting the book
    res.json({
      message: `Book ${bookId} deleted successfully`,
      data: deletedBook
    });
  } catch (err) {
    logger.error(`Error deleting book with ID ${req.params.id}:`, err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Search for books by title or author
 * This controller searches books using a query parameter and returns books that match the search term.
 */
exports.searchBooks = async (req, res, next) => {
  try {
    const query = req.query.q;  // Get the search query from the URL parameters

    const books = await bookService.searchBooks(query);  // Call the service to search books
    logger.info(`Searched books with query: "${query}"`);  // Log the success of the search
    res.json({
      message: `Books matching query "${query}" retrieved`,
      data: books
    });
  } catch (err) {
    logger.error(`Error searching books with query "${req.query.q}":`, err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};

/**
 * Add a review to a book
 * This controller allows users to add a review to a book.
 * It validates that both rating and comment are present in the request.
 */
exports.addReview = async (req, res, next) => {
  try {
    const bookId = req.params.id;  // Get the book ID from the URL parameters
    const reviewData = req.body;  // Get the review data from the request body

    if (!reviewData.rating || !reviewData.comment) {
      logger.warn('Review creation failed: Rating and comment are required');  // Log validation failure
      return res.status(400).json({ message: 'Rating and comment are required' });  // Validate input
    }

    const updatedBook = await bookService.addReview(bookId, reviewData);  // Call the service to add the review
    logger.info(`Added review to book with ID: ${bookId}`);  // Log the success of adding the review
    res.json({
      message: 'Review added successfully',
      data: updatedBook
    });
  } catch (err) {
    logger.error(`Error adding review to book with ID ${req.params.id}:`, err.message);  // Log the error
    next(err);  // Pass the error to the error-handling middleware
  }
};
