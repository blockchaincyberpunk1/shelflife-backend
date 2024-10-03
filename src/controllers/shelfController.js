const Shelf = require("../models/Shelf");  // Import the Shelf model
const shelfService = require("../services/shelfService");  // Import the shelf service containing business logic
const logger = require('../utils/logger');  // Import Winston logger for logging

/**
 * Fetch all shelves for the authenticated user
 */
exports.getAllShelves = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user
    const shelves = await shelfService.getShelvesByUserId(userId);  // Fetch shelves for the user
    if (shelves.length === 0) {
      return res.status(404).json({ message: "No shelves found for the user" });
    }
    
    res.json({
      message: "Shelves retrieved successfully",
      data: shelves
    });
    logger.info(`Fetched all shelves for user ${userId}`);
  } catch (err) {
    logger.error(`Error fetching shelves for user ${req.user._id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Fetch a specific shelf by its ID
 */
exports.getShelfById = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters
    if (!shelfId) {
      return res.status(400).json({ message: "Shelf ID is required" });
    }

    const shelf = await shelfService.getShelfById(shelfId);  // Call the service to fetch the shelf by ID
    if (!shelf) {
      return res.status(404).json({ message: "Shelf not found" });
    }

    res.json({
      message: "Shelf retrieved successfully",
      data: shelf
    });
    logger.info(`Fetched shelf ${shelfId}`);
  } catch (err) {
    logger.error(`Error fetching shelf ${req.params.id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Create a new shelf for the authenticated user
 */
exports.createShelf = async (req, res, next) => {
  try {
    const userId = req.user._id;  // Get the user ID from the authenticated user
    const newShelfData = req.body;

    // Ensure the shelf has a name
    if (!newShelfData.name) {
      return res.status(400).json({ message: 'Shelf name is required' });
    }

    newShelfData.userId = userId;  // Associate the shelf with the authenticated user

    const newShelf = await shelfService.createShelf(newShelfData);  // Call the service to create the new shelf
    res.status(201).json({
      message: "Shelf created successfully",
      data: newShelf
    });
    logger.info(`Created a new shelf for user ${userId}`);
  } catch (err) {
    logger.error('Error creating shelf', { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Update a shelf by its ID
 */
exports.updateShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters
    const updateData = req.body;  // Get the updated data from the request body

    if (!shelfId) {
      return res.status(400).json({ message: "Shelf ID is required" });
    }

    const updatedShelf = await shelfService.updateShelf(shelfId, updateData);  // Call the service to update the shelf
    if (!updatedShelf) {
      return res.status(404).json({ message: "Shelf not found" });
    }

    res.json({
      message: "Shelf updated successfully",
      data: updatedShelf
    });
    logger.info(`Updated shelf ${shelfId}`);
  } catch (err) {
    logger.error(`Error updating shelf ${req.params.id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};

/**
 * Delete a shelf by its ID
 */
exports.deleteShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id;  // Get the shelf ID from the request parameters
    if (!shelfId) {
      return res.status(400).json({ message: "Shelf ID is required" });
    }

    const deletedShelf = await shelfService.deleteShelf(shelfId);  // Call the service to delete the shelf
    if (!deletedShelf) {
      return res.status(404).json({ message: "Shelf not found" });
    }

    res.json({
      message: "Shelf deleted successfully"
    });
    logger.info(`Deleted shelf ${shelfId}`);
  } catch (err) {
    logger.error(`Error deleting shelf ${req.params.id}`, { error: err.message });
    next(err);  // Pass any error to the error-handling middleware
  }
};
