// const express = require('express');
// const bcrypt = require('bcrypt');
// const validator = require('validator');
// const User = require('../models/users');
// const router = express.Router();

// // Create new user
// router.post('/', async (req, res) => {
//   try {
//     const { firstName, lastName, email, displayName, password } = req.body;
//       if (!validator.isEmail(email)) {
//       return res.status(400).send({ message: 'Please provide a valid email address' });
//     }
//     if (!isPasswordValid(password, firstName, lastName, email, displayName)) {
//       return res.status(400).send({ message: 'Invalid password' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       displayName,
//       password: hashedPassword,
//     });

//     const newUser = await user.save();
//     // const userToReturn = await User.findById(newUser._id).select('-password');
//     res.status(201).send(newUser);
//   } catch (error) {
//     res.status(400).send({ message: "Error creating user", error: error.message });
//   }
// });

// // Register new user
// router.post('/register', async (req, res) => {
//   try {
//     const { firstName, lastName, email, displayName, password, confirmPassword } = req.body;
//     if (!validator.isEmail(email)) {
//       return res.status(400).send({ message: 'Please provide a valid email address' });
//     }
//     if (!isPasswordValid(password, firstName, lastName, email, displayName)) {
//       return res.status(400).send({ message: 'Invalid password' });
//     }
//     if (password !== confirmPassword) {
//       return res.status(400).send({ message: 'Passwords do not match' });
//     }
//     const existingUser = await User.findOne({ $or: [{ email }, { displayName }] });
//     if (existingUser) {
//       return res.status(400).send({ message: 'Email or display name already taken' });
//     }
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       displayName,
//       password: hashedPassword,
//     });
//     await newUser.save();
//     res.status(201).send({ message: 'User created successfully'});
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Server error', error: error.message });
//   }
// });

// // Login user
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).send({ message: 'User not found LOGIN' });
//     }
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).send({ message: 'Invalid credentials' });
//     }
//     res.status(200).send({ message: 'Login successful', user: { displayName: user.displayName } });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send({ message: 'Server error', error: error.message });
//   }
// });

// // Get all users
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.send(users);
//   } catch (error) {
//     res.status(500).send({ message: 'Error retrieving users', error: error.message });
//   }
// });

// // Get a specific user
// router.get('/:id', getUser, (req, res) => {
//   res.send(res.user);
// });

// // Middleware to get a user by id
// async function getUser(req, res, next) {
//   try {
//     const user = await User.findById(req.params.id).select('-password');
//     if (user == null) {
//       return res.status(404).send({ message: 'User not found GETUSER'});
//     }
//     res.user = user;
//     next();
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// }

// //Function to validate password
// function isPasswordValid(password, firstName, lastName, email, displayName) {
//   const lowerPassword = password.toLowerCase();
//   return !(
//     lowerPassword.includes(firstName.toLowerCase()) ||
//     lowerPassword.includes(lastName.toLowerCase()) ||
//     lowerPassword.includes(email.toLowerCase()) ||
//     lowerPassword.includes(displayName.toLowerCase())
//   );
// }

// module.exports = router;

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
    if (!isPasswordValid(password, firstName, lastName, email, displayName)) {
      return res.status(400).send({ message: 'Invalid password' });
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
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});
// Get a specific user by id
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
    res.status(200).send({ message: 'Login successful', user: { displayName: user.displayName } });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error', error: error.message });
  }
});
// Get a specific user by id
router.get('/login', (req, res) => {
  res.send({
    message: 'This is the login page or form handler.',
  });
});

// Create new user (alternative route, can be removed if it's redundant)
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, displayName, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: 'Please provide a valid email address' });
    }
    if (!isPasswordValid(password, firstName, lastName, email, displayName)) {
      return res.status(400).send({ message: 'Invalid password' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      displayName,
      password: hashedPassword,
    });
    const newUser = await user.save();
    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).send({ message: "Error creating user", error: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving users', error: error.message });
  }
});

// // Get a specific user by id
router.get('/:id', getUser, (req, res) => {
  res.send(res.user);
});

// Middleware to get a user by id
async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user == null) {
      return res.status(404).send({ message: 'User not found GETUSER' });
    }
    res.user = user;
    next();
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

// Function to validate password
function isPasswordValid(password, firstName, lastName, email, displayName) {
  const lowerPassword = password.toLowerCase();
  return !(
    lowerPassword.includes(firstName.toLowerCase()) ||
    lowerPassword.includes(lastName.toLowerCase()) ||
    lowerPassword.includes(email.toLowerCase()) ||
    lowerPassword.includes(displayName.toLowerCase())
  );
}

module.exports = router;
