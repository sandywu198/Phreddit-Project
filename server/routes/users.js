const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const User = require('../models/users');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'example_jwt';

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, displayName, password, confirmPassword } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).send({message: 'Please provide a valid email address'});
    }
    const lowerPassword = password.toLowerCase();
    if (lowerPassword.includes(firstName.toLowerCase())) {
      return res.status(400).send({message: 'Password cannot contain your first name!'});
    } else if(lowerPassword.includes(lastName.toLowerCase())){
      return res.status(400).send({message: 'Password cannot contain your last name!'});
    } else if(lowerPassword.includes(email.toLowerCase())){
      return res.status(400).send({message: 'Password cannot contain your email!'});
    } else if(lowerPassword.includes(displayName.toLowerCase())){
      return res.status(400).send({message: 'Password cannot contain your display name!'});
    }
    if (password !== confirmPassword) {
      return res.status(400).send({message: 'Passwords do not match' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { displayName }] });
    if (existingUser) {
      return res.status(400).send({message: 'Email or display name already taken' });
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

// Login user
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).send({message: 'User not found'});
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send({message: 'Invalid credentials'});
    }
    const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: '7d'});
    req.session.token = token;
    req.session.user = user;
    console.log("\n req.session: ", req.session, "\n");
    res.send({ message: 'Login successful', user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({message: 'Server error', error: error.message});
  }
});

// change the user reputation
router.patch('/:id/:num/reputation', getUser, async(req,res) =>{
  try{
    console.log("\n res.user before: ", res.user, "\n");
    console.log("\n req.params.num before: ", req.params.num, "\n");
    if(Number(req.params.num) === 1){
      res.user.reputation = res.user.reputation + 5;
    } else if(Number(req.params.num) === -1) {
      res.user.reputation = res.user.reputation - 10;
    } else{
      res.user.reputation = res.user.reputation + Number(req.params.num);
    }
    // res.user.userVoted = res.user.userVoted + 
    // ((Number(req.params.num) === 1) ? 5 : ((Number(req.params.num) === -1) ? -10 : 0));
    console.log("\n res.user after: ", res.user, "\n");
    const updatedUser = await res.user.save();
    res.send(updatedUser);
  }
  catch(error){
      res.status(400).send({message: "Error updating user reputation", error});
  }
});

// Check for returning user who didn't log out
router.get('/return-session', async (req, res) => {
  try {
    console.log("\n check returning: ", req.session, "\n");
    const token = req.session.token;
    if (!token) {
      return res.status(200).send({
        isAuthenticated: false,
        message: 'No active session found',
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    const user = await User.findById(decoded.userId);
    console.log("\n user: ", user);
    if (!user) {
      return res.status(200).send({
        isAuthenticated: false,
        message: 'No user found for the session',
      });
    }
    res.send({isAuthenticated: true, user: user});
  } catch (err) {
    res.status(200).send({
      isAuthenticated: false,
      message: 'Session is not valid',
    });
  }
});

// Delete session when user logs out
router.post('/logout', async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send({message: 'Failed to logout'});
      }
      res.send({message: 'Logged out successfully'});
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({message: 'Server error'});
  }
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
router.get('/:email/email', async (req, res) => {
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

// Get a specific user by first name
router.get('/:firstName/firstName', async (req, res) => {
  try {
    const firstName = req.params.firstName;
    const user = await User.findOne({ firstName });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user); // This sends the user object as JSON
  } catch (error) {
    res.status(500).send('Server error');
  }
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
