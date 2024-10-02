const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (username, email, password, profilePicture) => {
    try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword,
      profilePicture: profilePicture || 'https://example.com/default-profile-pic.jpg' // Use default if not provided 
    });
    return await newUser.save();
  } catch (err) {
    throw err; 
  }
};

exports.login = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null; 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    // Create and sign a JWT
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET); 
    return token;
  } catch (err) {
    throw err;
  }
};