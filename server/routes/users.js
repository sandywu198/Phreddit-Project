const express = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/users');  // Import the User model
const router = express.Router();

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, displayName, password, passwordConfirm } = req.body;
  // Check if email is in a valid format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Please provide a valid email address' });
  }
  // Check if the password is valid
  const lowerPassword = password.toLowerCase();
  if (!lowerPassword.includes(firstName.toLowerCase()) &&
    !lowerPassword.includes(lastName.toLowerCase()) &&
    !lowerPassword.includes(email.toLowerCase()) &&
    !lowerPassword.includes(displayName.toLowerCase())) {
    return res.status(400).json({ message: 'Password cannot contain your name, email, or display name' });
  }
  // Make sure passwords are the same
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  try {
    // Check if there's an existing user with the same email or display name
    const existingUser = await User.findOne({ $or: [{ email }, { displayName }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or display name already taken' });
    }
    // Create new user if everything is valid
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      displayName,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = await user.isCorrectPassword(password);
        if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user: { displayName: user.displayName } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
  
module.exports = router;
