const Shelf = require("../models/Shelf");  // Import the Shelf model
const Book = require("../models/Book");    // Import the Book model

/**
 * Fetch all shelves for a specific user
 * @param {string} userId - The ID of the user whose shelves are being fetched
 * @returns {Promise<Array>} - A promise that resolves to an array of shelves
 */
exports.getShelvesByUserId = async (userId) => {
  try {
    // Fetch shelves where the 'userId' matches the provided user ID
    const shelves = await Shelf.find({ userId }).populate("books");
    return shelves;
  } catch (err) {
    // Log the error (optional: use a logger)
    logger.error(`Error fetching shelves for user ID ${userId}: ${err.message}`);
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
    const shelf = await Shelf.findOne({ _id: shelfId, userId }).populate("books");

    if (!shelf) {
      throw new Error('Shelf not found or access denied.');
    }

    return shelf;
  } catch (err) {
    // Log the error (optional: use a logger)
    logger.error(`Error fetching shelf ID ${shelfId} for user ID ${userId}: ${err.message}`);
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
    // Create a new shelf instance with the provided data
    const newShelf = new Shelf(shelfData);
    
    // Save the new shelf to the database
    await newShelf.save();
    return newShelf;
  } catch (err) {
    // Log the error (optional: use a logger)
    logger.error(`Error creating new shelf: ${err.message}`);
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
    const updatedShelf = await Shelf.findOneAndUpdate(
      { _id: shelfId, userId },  // Ensure only the owner can update the shelf
      updateData,
      { new: true }  // Return the updated document
    ).populate("books");

    if (!updatedShelf) {
      throw new Error('Shelf not found or access denied.');
    }

    return updatedShelf;
  } catch (err) {
    // Log the error (optional: use a logger)
    logger.error(`Error updating shelf ID ${shelfId} for user ID ${userId}: ${err.message}`);
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
    await Book.updateMany({ shelf: shelfId }, { $set: { shelf: null } });

    // Find and delete the shelf by its ID and ensure it belongs to the user
    const deletedShelf = await Shelf.findOneAndDelete({ _id: shelfId, userId });

    if (!deletedShelf) {
      throw new Error('Shelf not found or access denied.');
    }

    return deletedShelf;
  } catch (err) {
    // Log the error (optional: use a logger)
    logger.error(`Error deleting shelf ID ${shelfId} for user ID ${userId}: ${err.message}`);
    throw new Error('Could not delete the shelf. Please try again.');
  }
};
