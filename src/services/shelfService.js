const Shelf = require("../models/Shelf"); // Import the Shelf model
const Book = require("../models/Book"); // Import the Book model

/**
 * Fetch all shelves for a specific user
 * @param {string} userId - The ID of the user whose shelves are being fetched
 * @returns {Promise<Array>} - A promise that resolves to an array of shelves
 */
exports.getShelvesByUserId = async (userId) => {
  try {
    // Fetch shelves where the 'userId' matches the provided user ID
    // Populate the 'books' field in each shelf document
    const shelves = await Shelf.find({ userId }).populate("books");
    return shelves;
  } catch (err) {
    throw new Error('Could not fetch shelves for the user.');
  }
};

/**
 * Fetch a specific shelf by its ID for the authenticated user
 * @param {string} shelfId - The ID of the shelf being fetched
 * @param {string} userId - The ID of the user who owns the shelf
 * @returns {Promise<Object>} - A promise that resolves to the shelf object
 */
exports.getShelfById = async (shelfId, userId) => {
  try {
    // Find a shelf that matches both the 'shelfId' and 'userId'
    // Populate the 'books' field in the shelf document
    const shelf = await Shelf.findOne({ _id: shelfId, userId }).populate("books");

    if (!shelf) {
      throw new Error('Shelf not found or access denied.'); // Custom error message for missing or unauthorized shelf access
    }

    return shelf; // Return the found shelf object
  } catch (err) {
    throw new Error('Could not fetch the shelf.');
  }
};

/**
 * Create a new shelf for the authenticated user
 * @param {Object} shelfData - The data for the new shelf (name, books, userId, etc.)
 * @returns {Promise<Object>} - A promise that resolves to the newly created shelf
 */
exports.createShelf = async (shelfData) => {
  try {
    // Create a new shelf instance using the provided data
    const newShelf = new Shelf(shelfData);
    
    // Save the new shelf to the database
    await newShelf.save();
    return newShelf; // Return the newly created shelf
  } catch (err) {
    throw new Error('Could not create the shelf. Please try again.');
  }
};

/**
 * Update an existing shelf by its ID (owned by the authenticated user)
 * @param {string} shelfId - The ID of the shelf to update
 * @param {string} userId - The ID of the user who owns the shelf
 * @param {Object} updateData - The data to update on the shelf
 * @returns {Promise<Object>} - A promise that resolves to the updated shelf
 */
exports.updateShelf = async (shelfId, userId, updateData) => {
  try {
    // Find the shelf by its ID and ensure it belongs to the user, then update it
    // Return the updated document after modifying it
    const updatedShelf = await Shelf.findOneAndUpdate(
      { _id: shelfId, userId },  // Ensure the shelf belongs to the user
      updateData,                // Apply the updates
      { new: true }              // Return the updated document
    ).populate("books");          // Populate the 'books' field with book data

    if (!updatedShelf) {
      throw new Error('Shelf not found or access denied.'); // Custom error for missing or unauthorized shelf update
    }

    return updatedShelf; // Return the updated shelf
  } catch (err) {
    throw new Error('Could not update the shelf. Please try again.');
  }
};

/**
 * Delete a shelf by its ID (owned by the authenticated user)
 * @param {string} shelfId - The ID of the shelf to delete
 * @param {string} userId - The ID of the user who owns the shelf
 * @returns {Promise<Object>} - A promise that resolves to the deleted shelf
 */
exports.deleteShelf = async (shelfId, userId) => {
  try {
    // Remove the shelf reference from associated books before deleting the shelf
    await Book.updateMany({ shelf: shelfId }, { $set: { shelf: null } }); // Set 'shelf' field to null for associated books

    // Find and delete the shelf by its ID and ensure it belongs to the user
    const deletedShelf = await Shelf.findOneAndDelete({ _id: shelfId, userId }); // Delete shelf if owned by the user

    if (!deletedShelf) {
      throw new Error('Shelf not found or access denied.'); // Custom error for unauthorized or non-existent shelf
    }

    return deletedShelf; // Return the deleted shelf object
  } catch (err) {
    throw new Error('Could not delete the shelf. Please try again.');
  }
};

/**
 * Add a book to a shelf
 * @param {string} shelfId - The ID of the shelf to add the book to
 * @param {string} bookId - The ID of the book to add
 * @param {string} userId - The ID of the user who owns the shelf
 * @returns {Promise<Object>} - A promise that resolves to the updated shelf
 */
exports.addBookToShelf = async (shelfId, bookId, userId) => {
  try {
    // Use the Shelf model's static method to add a book to the shelf
    const updatedShelf = await Shelf.addBookToShelf(shelfId, bookId);
    return updatedShelf;
  } catch (err) {
    throw new Error('Could not add the book to the shelf. Please try again.');
  }
};

/**
 * Remove a book from a shelf
 * @param {string} shelfId - The ID of the shelf to remove the book from
 * @param {string} bookId - The ID of the book to remove
 * @param {string} userId - The ID of the user who owns the shelf
 * @returns {Promise<Object>} - A promise that resolves to the updated shelf
 */
exports.removeBookFromShelf = async (shelfId, bookId, userId) => {
  try {
    // Use the Shelf model's static method to remove a book from the shelf
    const updatedShelf = await Shelf.removeBookFromShelf(shelfId, bookId);
    return updatedShelf;
  } catch (err) {
    throw new Error('Could not remove the book from the shelf. Please try again.');
  }
};