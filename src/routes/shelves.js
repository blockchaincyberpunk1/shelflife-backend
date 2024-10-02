const express = require('express'); // Import Express to create a new router instance
const router = express.Router(); // Create a new router instance using Express
const shelfController = require('../controllers/shelfController'); // Import the shelf controller to handle the business logic

// Route to get all shelves
// This route handles GET requests to the base URL ('/shelves') and calls the shelfController's getAllShelves method.
// In future implementations, it could be filtered by user if user authentication is implemented.
router.get('/', shelfController.getAllShelves);

// Route to get a specific shelf by its ID
// This route handles GET requests to '/shelves/:id', where ':id' is the dynamic ID of the shelf to be retrieved.
// The shelfController.getShelfById method is called to return the shelf with the specified ID.
router.get('/:id', shelfController.getShelfById);

// Route to create a new shelf
// This route handles POST requests to the base URL ('/shelves') and expects the new shelf data to be provided in the request body.
// The shelfController.createShelf method is called to create and save the new shelf in the database.
router.post('/', shelfController.createShelf);

// Route to update an existing shelf by its ID
// This route handles PUT requests to '/shelves/:id' where ':id' represents the ID of the shelf to be updated.
// The shelfController.updateShelf method is called, and the update data is expected to be provided in the request body.
router.put('/:id', shelfController.updateShelf);

// Route to delete a shelf by its ID
// This route handles DELETE requests to '/shelves/:id', where ':id' is the ID of the shelf to be deleted.
// The shelfController.deleteShelf method is called to remove the shelf from the database.
router.delete('/:id', shelfController.deleteShelf);

module.exports = router; // Export the router so it can be used in the main application
