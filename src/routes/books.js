const express = require('express');  // Import Express
const router = express.Router();  // Create a new router object for handling book-related routes
const bookController = require('../controllers/bookController');  // Import the bookController
const { check } = require('express-validator');  // Import express-validator for input validation
const { validate } = require('../middleware/validation');  // Import the validation middleware
const { authenticateJWT } = require('../middleware/authMiddleware');  // Import authentication middleware to protect routes

/**
 * @route GET /books
 * @description Fetch all books
 * @access Private
 */
router.get('/', authenticateJWT, bookController.getAllBooks);  // Protect route with authentication

/**
 * @route GET /books/shelf/:shelfId
 * @description Fetch books by shelf ID
 * @access Private
 */
router.get('/shelf/:shelfId', authenticateJWT, bookController.getBooksByShelf);  // Protect route with authentication

/**
 * @route PUT /books/:id
 * @description Update a book's shelf association
 * @access Private
 */
router.put('/:id', authenticateJWT, [
  check('shelf')
    .notEmpty()
    .withMessage('Shelf ID is required'),  // Validate that a shelf ID is provided
], validate, bookController.updateBookShelf);  // Protect route with authentication and validation

/**
 * @route POST /books
 * @description Add a new book to the collection
 * @access Private
 */
router.post('/', [
  // Validate the title: it must be non-empty
  check('title')
    .notEmpty()
    .withMessage('Title is required'),

  // Validate the authors field: it must be an array and contain at least one author
  check('authors')
    .isArray({ min: 1 })
    .withMessage('At least one author is required'),

  // Optionally, validate the coverImageUrl if it's provided
  check('coverImageUrl')
    .optional()
    .isURL()
    .withMessage('Invalid URL for cover image'),
], validate, authenticateJWT, bookController.createBook);  // Protect route with authentication and validation

/**
 * @route GET /books/search
 * @description Search for books by title or author
 * @access Public
 */
router.get('/search', bookController.searchBooks);  // No authentication required for searching

module.exports = router;  // Export the router for use in the application
