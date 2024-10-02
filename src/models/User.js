const mongoose = require('mongoose');  // Import Mongoose library for MongoDB connection
const bcrypt = require('bcrypt');  // Import bcrypt for password hashing

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,  // Trim whitespace from the username
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);  // Basic email format validation
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  profilePicture: {
    type: String,  // Store the URL of the profile picture
    default: 'https://images.pexels.com/photos/1697912/pexels-photo-1697912.jpeg',  // Default profile picture URL
  },
  roles: [{
    type: String,
    enum: ['user', 'admin'],  // Define acceptable roles
    default: 'user'
  }]
}, { timestamps: true });  // Automatically manage createdAt and updatedAt fields

// Pre-save hook to hash the password before saving a new user
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);  // Generate a salt
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password with the salt
    next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare the entered password with the hashed password stored in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the User model to use in the application
module.exports = mongoose.model('User', userSchema);
