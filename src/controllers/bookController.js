const Book = require('../models/Book'); // Import the Book model
const bookService = require('../services/bookService'); // Import the book service which contains business logic

// Fetch all books and return them as JSON
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await bookService.getAllBooks(); // Call the service to fetch all books
        res.json(books); // Respond with the books in JSON format
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};

// Fetch books that belong to a specific shelf
exports.getBooksByShelf = async (req, res, next) => {
    try {
        const shelfId = req.params.shelfId; // Get the shelfId from the URL parameters
        const books = await bookService.getBooksByShelf(shelfId); // Call the service to fetch books by shelf ID
        res.json(books); // Respond with the books in JSON format
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};

// Update the shelf a book belongs to
exports.updateBookShelf = async (req, res, next) => {
    try {
        const bookId = req.params.id; // Get the bookId from the URL parameters
        const newShelfId = req.body.shelf; // Get the new shelf ID from the request body
        const updatedBook = await bookService.updateBookShelf(bookId, newShelfId); // Call the service to update the book's shelf
        res.json(updatedBook); // Respond with the updated book in JSON format
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};

// Create a new book and return it as JSON
exports.createBook = async (req, res, next) => {
    try {
        const newBookData = req.body; // Get the new book data from the request body
        const newBook = await bookService.createBook(newBookData); // Call the service to create a new book
        res.status(201).json(newBook); // Respond with the new book and set the status to 201 (Created)
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};

// Search for books by title or author using a query parameter
exports.searchBooks = async (req, res, next) => {
    try {
        const query = req.query.q; // Get the search query from the query string (URL parameters)
        const books = await bookService.searchBooks(query); // Call the service to search books by title or author
        res.json(books); // Respond with the matching books in JSON format
    } catch (err) {
        next(err); // Pass the error to the error-handling middleware
    }
};
