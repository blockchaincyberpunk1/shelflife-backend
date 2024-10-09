const mongoose = require('mongoose'); // Import Mongoose for connecting to MongoDB
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

/**
 * Define the User schema for the 'users' collection in MongoDB.
 * This schema models the data structure of each user in the system, including fields like 
 * username, email, password, profile picture, roles, settings, and tokens for password reset.
 */
const userSchema = new mongoose.Schema({
  
  // Username: This is a required field. The username must be unique, trimmed of whitespace, 
  // and must contain at least 3 characters.
  username: {
    type: String, 
    required: [true, 'Username is required'], // Custom error message for missing username
    unique: true,  // Enforces unique usernames in the database
    trim: true,  // Trims whitespace from both ends of the username
    minlength: [3, 'Username must be at least 3 characters long'], // Minimum length of 3 characters
  },

  // Email: This is a required field. The email must be unique, lowercase, and trimmed of whitespace. 
  // A custom validation function ensures that the email format is valid.
  email: {
    type: String, 
    required: [true, 'Email is required'], // Custom error message for missing email
    unique: true,  // Enforces unique email addresses
    trim: true,  // Trims whitespace from both ends of the email address
    lowercase: true,  // Stores the email in lowercase format
    validate: {
      validator: function (v) {
        // Regular expression to validate the email format
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); 
      },
      // Custom error message for invalid email format
      message: props => `${props.value} is not a valid email!`
    }
  },

  // Password: A required field where the password must have at least 6 characters. 
  // The password will be hashed before saving.
  password: {
    type: String, 
    required: [true, 'Password is required'], // Custom error message for missing password
    minlength: [6, 'Password must be at least 6 characters long'],  // Minimum length of 6 characters
  },

  // Profile Picture: An optional URL for the user's profile picture. 
  // A default placeholder image URL is provided if none is specified.
  profilePicture: {
    type: String, 
    default: 'https://images.pexels.com/photos/1697912/pexels-photo-1697912.jpeg', // Default image
  },

  // Roles: An array that stores the user's roles (e.g., 'user' or 'admin'). 
  // By default, all users are assigned the 'user' role.
  roles: [{
    type: String, 
    enum: ['user', 'admin'],  // Restricts the roles to either 'user' or 'admin'
    default: 'user' // Default role is 'user'
  }],

  // Settings: A nested object that stores user-specific settings such as notifications and email preferences.
  settings: {
    notificationsEnabled: {
      type: Boolean, 
      default: true  // Notifications are enabled by default
    },
    emailPreference: {
      type: String, 
      enum: ['daily', 'weekly', 'monthly'],  // Options for how frequently users want to receive emails
      default: 'weekly'  // Default email frequency is weekly
    }
  },

  // Password Reset Token: Used for resetting the user's password. 
  // The token will be a hashed value.
  passwordResetToken: String, 

  // Password Reset Expiry: Specifies when the password reset token expires. 
  passwordResetExpires: Date,

}, { timestamps: true });  // Automatically manages 'createdAt' and 'updatedAt' fields

/**
 * Pre-save hook: Before saving a new user or updating a password, the password is hashed.
 * This ensures that the password is always securely stored in the database.
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified or is new (i.e., not already hashed)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);  // Generate a salt with a complexity factor of 10
    this.password = await bcrypt.hash(this.password, salt);  // Hash the password using the salt
    next();  // Continue the save process
  } catch (err) {
    return next(err);  // Pass any errors to the next middleware
  }
});

/**
 * Method to compare the provided password with the hashed password stored in the database.
 * This is used during user login to verify the user's credentials.
 * @param {String} candidatePassword - The plain text password provided by the user
 * @returns {Boolean} - Returns true if the passwords match, otherwise false
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);  // Compare the passwords
};

/**
 * Method to generate a JWT (JSON Web Token) for the authenticated user.
 * The token is signed with the user's unique ID and a secret key from environment variables.
 * @returns {String} - Returns the generated JWT token
 */
userSchema.methods.generateJWT = function () {
  const jwt = require('jsonwebtoken');  // Import JSON Web Token library
  return jwt.sign(
    { sub: this._id },  // The payload contains the user's unique ID
    process.env.JWT_SECRET,  // The secret key from environment variables
    { expiresIn: '1h' }  // Token expires in 1 hour
  );
};

// Export the User model for use in other parts of the application (e.g., for user CRUD operations)
module.exports = mongoose.model('User', userSchema);
