const shelfService = require('../services/shelfService');  // Import shelf service containing business logic
const logger = require('../utils/logger');  // Import Winston logger for logging

/**
 * Fetch all shelves for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getAllShelves = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user
    const shelves = await shelfService.getShelvesByUserId(userId);  // Fetch shelves for the user

    if (shelves.length === 0) {
      return res.status(404).json({ message: 'No shelves found for the user' });
    }

    res.status(200).json({
      message: 'Shelves retrieved successfully',
      data: shelves,
    });
    logger.info(`Fetched all shelves for user ${userId}`);
  } catch (err) {
    logger.error(`Error fetching shelves for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Fetch a specific shelf by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.getShelfById = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters

    if (!shelfId) {
      return res.status(400).json({ message: 'Shelf ID is required' });
    }

    const userId = req.user._id;  // Get user ID from the authenticated user
    const shelf = await shelfService.getShelfById(shelfId, userId);  // Fetch the shelf by ID

    res.status(200).json({
      message: 'Shelf retrieved successfully',
      data: shelf,
    });
    logger.info(`Fetched shelf ${shelfId} for user ${userId}`);
  } catch (err) {
    logger.error(`Error fetching shelf ${req.params.id} for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Create a new shelf for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.createShelf = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user
    const { name, books } = req.body;  // Extract name and books from the request body

    if (!name) {
      return res.status(400).json({ message: 'Shelf name is required' });
    }

    const newShelfData = {
      userId,
      name,
      books,
    };

    const newShelf = await shelfService.createShelf(newShelfData);  // Create the new shelf
    res.status(201).json({
      message: 'Shelf created successfully',
      data: newShelf,
    });
    logger.info(`Created a new shelf for user ${userId}`);
  } catch (err) {
    logger.error('Error creating shelf', { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Update a shelf by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.updateShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters
    const updateData = req.body;  // Get the updated data from the request body
    const userId = req.user._id;  // Get user ID from the authenticated user

    if (!shelfId) {
      return res.status(400).json({ message: 'Shelf ID is required' });
    }

    const updatedShelf = await shelfService.updateShelf(shelfId, userId, updateData);  // Update the shelf
    res.status(200).json({
      message: 'Shelf updated successfully',
      data: updatedShelf,
    });
    logger.info(`Updated shelf ${shelfId} for user ${userId}`);
  } catch (err) {
    logger.error(`Error updating shelf ${req.params.id} for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Delete a shelf by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.deleteShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters
    const userId = req.user._id;  // Get user ID from the authenticated user

    if (!shelfId) {
      return res.status(400).json({ message: 'Shelf ID is required' });
    }

    await shelfService.deleteShelf(shelfId, userId);  // Delete the shelf
    res.status(200).json({ message: 'Shelf deleted successfully' });
    logger.info(`Deleted shelf ${shelfId} for user ${userId}`);
  } catch (err) {
    logger.error(`Error deleting shelf ${req.params.id} for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Add a book to a shelf
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.addBookToShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters
    const bookId = req.body.bookId;  // Get the book ID from the request body
    const userId = req.user._id;  // Get user ID from the authenticated user

    if (!shelfId || !bookId) {
      return res.status(400).json({ message: 'Shelf ID and Book ID are required' });
    }

    const updatedShelf = await shelfService.addBookToShelf(shelfId, bookId, userId);  // Add the book to the shelf
    res.status(200).json({
      message: 'Book added to shelf successfully',
      data: updatedShelf,
    });
    logger.info(`Added book ${bookId} to shelf ${shelfId} for user ${userId}`);
  } catch (err) {
    logger.error(`Error adding book to shelf ${req.params.id} for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Remove a book from a shelf
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
exports.removeBookFromShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters
    const bookId = req.body.bookId;  // Get the book ID from the request body
    const userId = req.user._id;  // Get user ID from the authenticated user

    if (!shelfId || !bookId) {
      return res.status(400).json({ message: 'Shelf ID and Book ID are required' });
    }

    const updatedShelf = await shelfService.removeBookFromShelf(shelfId, bookId, userId);  // Remove the book from the shelf
    res.status(200).json({
      message: 'Book removed from shelf successfully',
      data: updatedShelf,
    });
    logger.info(`Removed book ${bookId} from shelf ${shelfId} for user ${userId}`);
  } catch (err) {
    logger.error(`Error removing book from shelf ${req.params.id} for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};