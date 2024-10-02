const express = require('express'); // Import Express to create the router
const router = express.Router(); // Create a new Express router instance
const bookController = require('../controllers/bookController'); // Import the book controller which contains the logic for each route
const { check } = require('express-validator'); // Import validation middleware

// Route to fetch all books
// This route will call the `getAllBooks` method in the book controller and return all books in the system.
router.post('/', [
    check('title').notEmpty().withMessage('Title is required'),
    check('authors').isArray({ min: 1 }).withMessage('At least one author is required'),
    // ... other validation rules ...
], bookController.createBook); 

// Route to fetch books by shelf ID
// This route will call the `getBooksByShelf` method in the book controller.
// It takes a `shelfId` as a URL parameter and returns all books associated with that specific shelf.
router.get('/shelf/:shelfId', bookController.getBooksByShelf);

// Route to update a book's shelf
// This route will call the `updateBookShelf` method in the book controller.
// It takes a `bookId` from the URL and a `shelf` ID in the request body, then updates the book's shelf.
router.put('/:id', bookController.updateBookShelf);

// Route to add a new book
// This route will call the `createBook` method in the book controller to add a new book to the system.
// It expects book data to be provided in the request body (e.g., title, authors, etc.).
router.post('/', bookController.createBook);

// Route to search for books by title or author
// This route will call the `searchBooks` method in the book controller.
// It uses a query parameter `q` (for search query) to search books by title or author and returns matching results.
router.get('/search', bookController.searchBooks);

// Export the router so it can be used in the application
// This will make all the defined routes available to be used in the main app.
module.exports = router;
