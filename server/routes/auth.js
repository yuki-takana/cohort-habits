const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- NEW: Import jsonwebtoken

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists with that email' });
    }

    user = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // --- Create and return token after registration ---
    // (This automatically logs them in after they register)
    const payload = {
      user: {
        id: user.id, // This is the user's ID from MongoDB
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // Get the secret from .env
      { expiresIn: '30d' },    // Token expires in 30 days
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Send the token
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 2. Compare the plain-text password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // 3. If password matches, create the JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // 4. Sign and return the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '30d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token
      }
    );

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;