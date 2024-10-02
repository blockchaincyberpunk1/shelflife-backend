const Shelf = require('../models/Shelf'); // Import the Shelf model

// Fetch all shelves and populate the 'books' field with book data
// This function returns all shelves in the system, with each shelf including the books associated with it
exports.getAllShelves = async () => {
    return await Shelf.find().populate('books'); 
    // Use Mongoose's populate() method to replace the 'books' ObjectIds with full book documents
};

// Fetch a specific shelf by its ID and populate the 'books' field
// This function takes a shelfId as input and returns the corresponding shelf document, along with its associated books
exports.getShelfById = async (shelfId) => {
    return await Shelf.findById(shelfId).populate('books'); 
    // Find the shelf by its ObjectId and populate the 'books' field to get the full book data
};

// Create a new shelf in the database
// This function takes shelf data as input (e.g., name, userId, books) and creates a new shelf document
exports.createShelf = async (shelfData) => {
    const newShelf = new Shelf(shelfData);  // Create a new instance of the Shelf model
    return await newShelf.save();           // Save the new shelf to the database and return the result
};

// Update an existing shelf's details by its ID
// This function takes a shelfId and the updateData as input and updates the corresponding shelf document
// It returns the updated shelf with the populated 'books' field
exports.updateShelf = async (shelfId, updateData) => {
    return await Shelf.findByIdAndUpdate(shelfId, updateData, { new: true }).populate('books'); 
    // findByIdAndUpdate finds the shelf by its ID and applies the updates
    // The { new: true } option ensures that the updated document is returned
    // populate('books') fetches and includes the full book data for the shelf
};

// Delete a shelf by its ID
// This function takes a shelfId as input and removes the corresponding shelf from the database
exports.deleteShelf = async (shelfId) => {
    return await Shelf.findByIdAndDelete(shelfId); 
    // findByIdAndDelete removes the shelf document from the database
    // The result is the deleted shelf document (or null if it wasn't found)
};
