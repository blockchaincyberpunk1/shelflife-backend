const express = require('express');  // Import Express framework
const router = express.Router();  // Create a new router object for handling shelf-related routes
const shelfController = require('../controllers/shelfController');  // Import the shelf controller to handle requests
const { authenticateJWT } = require('../middleware/authMiddleware');  // Import JWT authentication middleware to protect routes
const { check } = require('express-validator');  // Import express-validator for input validation
const { validate } = require('../middleware/validation');  // Import custom validation middleware

/**
 * @route GET /shelves
 * @description Get all shelves for the authenticated user
 * @access Private
 */
router.get('/', authenticateJWT, shelfController.getAllShelves);  // Protect route with JWT authentication

/**
 * @route GET /shelves/:id
 * @description Get a specific shelf by its ID
 * @access Private
 */
router.get('/:id', authenticateJWT, shelfController.getShelfById);  // Protect route with JWT authentication

/**
 * @route POST /shelves
 * @description Create a new shelf for the authenticated user
 * @access Private
 */
router.post('/', 
  authenticateJWT,  // Protect route with JWT authentication
  [
    check('name')
      .notEmpty()
      .withMessage('Shelf name is required')  // Validate that the shelf name is provided
  ],
  validate,  // Use the validation middleware to handle validation errors
  shelfController.createShelf  // Call the controller to create the shelf
);

/**
 * @route PUT /shelves/:id
 * @description Update an existing shelf by its ID
 * @access Private
 */
router.put('/:id', 
  authenticateJWT,  // Protect route with JWT authentication
  [
    check('name')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Shelf name must be at least 1 character long')  // Validate the shelf name if provided
  ],
  validate,  // Use the validation middleware to handle validation errors
  shelfController.updateShelf  // Call the controller to update the shelf
);

/**
 * @route DELETE /shelves/:id
 * @description Delete a shelf by its ID
 * @access Private
 */
router.delete('/:id', authenticateJWT, shelfController.deleteShelf);  // Protect route with JWT authentication

/**
 * @route POST /shelves/:id/books
 * @description Add a book to a shelf
 * @access Private
 */
router.post('/:id/books', 
  authenticateJWT,  // Protect route with JWT authentication
  [
    check('bookId')
      .notEmpty()
      .withMessage('Book ID is required')  // Validate that the book ID is provided
  ],
  validate,  // Use the validation middleware to handle validation errors
  shelfController.addBookToShelf  // Call the controller to add the book to the shelf
);

/**
 * @route DELETE /shelves/:id/books
 * @description Remove a book from a shelf
 * @access Private
 */
router.delete('/:id/books', 
  authenticateJWT,  // Protect route with JWT authentication
  [
    check('bookId')
      .notEmpty()
      .withMessage('Book ID is required')  // Validate that the book ID is provided
  ],
  validate,  // Use the validation middleware to handle validation errors
  shelfController.removeBookFromShelf  // Call the controller to remove the book from the shelf
);

module.exports = router;  // Export the router for use in the application