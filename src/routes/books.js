const express = require('express');  // Import Express to create a router
const router = express.Router();  // Create a router instance for book-related routes
const { check } = require('express-validator');  // Import express-validator for input validation
const { validate } = require('../middleware/validation');  // Import validation middleware to handle request validation
const { authenticateJWT } = require('../middleware/authMiddleware');  // Import JWT authentication middleware
const bookController = require('../controllers/bookController');  // Import the book controller for handling requests

/**
 * @route GET /books
 * @description Fetch all books from the database
 * @access Private (authentication required)
 */
router.get('/', authenticateJWT, bookController.getAllBooks);

/**
 * @route GET /books/:id
 * @description Fetch a book by its ID
 * @access Public (no authentication required)
 */
router.get('/:id', bookController.getBookById);

/**
 * @route GET /books/shelf/:shelfId
 * @description Fetch all books by a specific shelf ID
 * @access Private (authentication required)
 */
router.get('/shelf/:shelfId', authenticateJWT, bookController.getBooksByShelf);

/**
 * @route PUT /books/:id/shelf
 * @description Update the shelf a book belongs to
 * @access Private (authentication required)
 */
router.put('/:id/shelf', authenticateJWT, [
  check('shelf')
    .notEmpty()
    .withMessage('Shelf ID is required')  // Validate that the 'shelf' field is provided
], validate, bookController.updateBookShelf);

/**
 * @route POST /books
 * @description Create a new book
 * @access Private (authentication required)
 */
router.post('/', authenticateJWT, [
  check('title')
    .notEmpty()
    .withMessage('Title is required'),  // Validate that the title is provided

  check('authors')
    .isArray({ min: 1 })
    .withMessage('At least one author is required'),  // Validate that at least one author is provided

  check('coverImageUrl')
    .optional()
    .isURL()
    .withMessage('Invalid URL for cover image')  // Optionally validate the cover image URL if provided
], validate, bookController.createBook);

/**
 * @route PUT /books/:id
 * @description Update a book's details (title, authors, genre, etc.)
 * @access Private (authentication required)
 */
router.put('/:id', authenticateJWT, [
  check('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty'),  // Validate that the title, if provided, is not empty

  check('authors')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Authors must be an array with at least one author'),  // Validate authors if provided

  check('coverImageUrl')
    .optional()
    .isURL()
    .withMessage('Invalid URL for cover image')  // Optionally validate the cover image URL if provided
], validate, bookController.updateBook);

/**
 * @route DELETE /books/:id
 * @description Delete a book by its ID
 * @access Private (authentication required)
 */
router.delete('/:id', authenticateJWT, bookController.deleteBook);

/**
 * @route GET /books/search
 * @description Search for books by title or author
 * @access Public (no authentication required)
 */
router.get('/search', bookController.searchBooks);

/**
 * @route POST /books/:id/review
 * @description Add a review to a book
 * @access Private (authentication required)
 */
router.post('/:id/review', authenticateJWT, [
  check('rating')
    .notEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),  // Validate that the rating is between 1 and 5

  check('comment')
    .notEmpty()
    .withMessage('Comment is required')  // Validate that a comment is provided
], validate, bookController.addReview);

module.exports = router;  // Export the router for use in the application
