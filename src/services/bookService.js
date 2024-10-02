const Book = require('../models/Book'); // Import the Book model to interact with the 'books' collection in MongoDB

// Function to get all books in the database
// This function does not filter by any specific criteria and returns all book documents
exports.getAllBooks = async () => {
    return await Book.find();  // Find all documents in the 'books' collection
};

// Function to get books that belong to a specific shelf
// The function takes a shelfId as input and returns all books assigned to that shelf
exports.getBooksByShelf = async (shelfId) => {
    return await Book.find({ shelf: shelfId });  // Find all books where the 'shelf' field matches the given shelfId
};

// Function to update a book's shelf
// Takes a bookId (to identify the book) and a newShelfId (the new shelf to assign)
// It uses the findByIdAndUpdate method to update the 'shelf' field and returns the updated book document
exports.updateBookShelf = async (bookId, newShelfId) => {
    return await Book.findByIdAndUpdate(bookId, { shelf: newShelfId }, { new: true }); 
    // { new: true } ensures that the updated document is returned
};

// Function to create a new book in the database
// It takes 'bookData' as input, creates a new instance of the Book model, and saves it to the database
exports.createBook = async (bookData) => {
    const newBook = new Book(bookData);  // Create a new book instance with the provided book data
    return await newBook.save();         // Save the book document to the database and return the result
};

// Function to search books by title or author
// The search is case-insensitive and uses a regular expression to match partial strings in the title or authors array
exports.searchBooks = async (query) => {
    // Create a case-insensitive regular expression for the search query
    const regex = new RegExp(query, 'i');  // 'i' flag makes it case-insensitive

    return await Book.find({
        $or: [                              // Use the '$or' operator to match either title or author
            { title: { $regex: regex } },   // Search books where the title matches the query (partially)
            { authors: { $in: [regex] } }   // Search books where any author matches the query (authors is an array)
        ]
    });
};
