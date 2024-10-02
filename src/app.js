const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet'); // For security headers
// ... other imports as needed (e.g., for authentication, routes)

const app = express();

// Middleware
app.use(helmet()); // Apply security headers
app.use(bodyParser.json()); 
app.use(cors()); 

// Database Connection
const mongoDB = 'mongodb://localhost:27017/shelflife'; // Replace with your MongoDB URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Routes (we'll add these later)
// ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
