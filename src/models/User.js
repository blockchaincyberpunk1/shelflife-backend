const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String, // Store the URL of the profile picture
    default: 'https://example.com/default-profile-pic.jpg', // Default profile picture URL
  }
});

module.exports = mongoose.model('User', userSchema);