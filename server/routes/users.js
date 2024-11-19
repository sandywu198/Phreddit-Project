const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/users');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, displayName, password, confirmPassword } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: 'Please provide a valid email address' });
    }
    const lowerPassword = password.toLowerCase();
    if (lowerPassword.includes(firstName.toLowerCase())) {
      return res.status(400).send({ message: 'Password cannot contain your name!' });
    } else if(lowerPassword.includes(lastName.toLowerCase())){
      return res.status(400).send({ message: 'Password cannot contain your name!' });
    } else if(lowerPassword.includes(email.toLowerCase())){
      return res.status(400).send({ message: 'Password cannot contain your email!' });
    } else if(lowerPassword.includes(displayName.toLowerCase())){
      return res.status(400).send({ message: 'Password cannot contain your display name!' });
    }
    if (password !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { displayName }] });
    if (existingUser) {
      return res.status(400).send({ message: 'Email or display name already taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      displayName,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});
// Get register
router.get('/register', (req, res) => {
  res.send({
    message: 'This is the registration page or form handler.',
  });
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ message: 'User not found LOGIN' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }
    res.status(201).send({ message: 'Login successful', user: user});
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});

// Get login 
router.get('/login', (req, res) => {
  res.send({
    message: 'This is the login page or form handler.',
  });
});

// Get all users
router.get('/', async (req, res) => {
  try {
    // const users = await User.find().select('-password'); //can use if we want to hide the password on the localhost
    const users = await User.find()
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving users', error: error.message });
  }
});

// Get a specific user by email
router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).send(user); // This sends the user object as JSON
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Get a specific user by id
router.get('/:id', getUser, (req, res) => {
  res.send(res.user);
});

// Delete user by id
router.delete('/:id', getUser, async (req, res) => {
  try {
    // if it's already been deleted, skip
    if(!res.user){
      return res.send({message: "User does not exist"});
    }
    await res.user.deleteOne(); 
    res.send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ message: error.message });
  }
});

// Middleware to get a user by id
async function getUser(req, res, next) {
  try {
    // const user = await User.findById(req.params.id).select('-password'); //can use if we want to hide the password on the localhost
    const user = await User.findById(req.params.id)
    // if (user == null) {
    //   return res.status(404).send({ message: 'User not found GETUSER' });
    // }
    res.user = user;
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

module.exports = router;
