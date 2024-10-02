const Shelf = require("../models/Shelf"); // Import the Shelf model
const shelfService = require("../services/shelfService"); // Import the shelf service where the business logic resides

// Fetch all shelves
// This function retrieves all shelves by calling the service layer's getAllShelves method
// A filter by user can be added later to ensure that only the shelves owned by the authenticated user are returned
exports.getAllShelves = async (req, res, next) => {
  try {
    const shelves = await shelfService.getAllShelves(); // Currently retrieves all shelves. Add user-specific filtering later
    res.json(shelves); // Send the shelves back as a JSON response
  } catch (err) {
    next(err); // Pass any error to the error-handling middleware
  }
};

// Fetch a single shelf by its ID
// This function retrieves a specific shelf by its ID
exports.getShelfById = async (req, res, next) => {
  try {
    const shelfId = req.params.id; // Get the shelf ID from the request parameters (URL)
    const shelf = await shelfService.getShelfById(shelfId); // Call the service method to get the shelf by ID
    if (!shelf) {
      return res.status(404).json({ message: "Shelf not found" }); // If the shelf is not found, return a 404 status with an error message
    }
    res.json(shelf); // Return the found shelf as a JSON response
  } catch (err) {
    next(err); // Pass any error to the error-handling middleware
  }
};

// Create a new shelf
// This function creates a new shelf by passing the provided data to the service layer
exports.createShelf = async (req, res, next) => {
  try {
    const newShelfData = req.body; // Get the new shelf data from the request body
    const newShelf = await shelfService.createShelf(newShelfData); // Call the service to create a new shelf
    res.status(201).json(newShelf); // Send a 201 Created response along with the newly created shelf
  } catch (err) {
    next(err); // Pass any error to the error-handling middleware
  }
};

// Update a shelf by its ID
// This function updates the details of a shelf identified by its ID
exports.updateShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id; // Get the shelf ID from the request parameters (URL)
    const updateData = req.body; // Get the updated data from the request body
    const updatedShelf = await shelfService.updateShelf(shelfId, updateData); // Call the service to update the shelf
    if (!updatedShelf) {
      return res.status(404).json({ message: "Shelf not found" }); // If the shelf is not found, return a 404 status with an error message
    }
    res.json(updatedShelf); // Return the updated shelf as a JSON response
  } catch (err) {
    next(err); // Pass any error to the error-handling middleware
  }
};

// Delete a shelf by its ID
// This function deletes a shelf identified by its ID
exports.deleteShelf = async (req, res, next) => {
  try {
    const shelfId = req.params.id; // Get the shelf ID from the request parameters (URL)
    const deletedShelf = await shelfService.deleteShelf(shelfId); // Call the service to delete the shelf
    if (!deletedShelf) {
      return res.status(404).json({ message: "Shelf not found" }); // If the shelf is not found, return a 404 status with an error message
    }
    // In a future enhancement, remove the shelf reference from associated books
    res.json({ message: "Shelf deleted successfully" }); // Return a success message after deletion
  } catch (err) {
    next(err); // Pass any error to the error-handling middleware
  }
};
