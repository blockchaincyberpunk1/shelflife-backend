const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const authService = require('../services/authService');

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, profilePicture } = req.body;
    const newUser = await authService.signup(username, email, password, profilePicture);
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const token = await authService.login(email, password);

    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' }); // 401 Unauthorized
    }
  } catch (err) {
    next(err);
  }
};