// routes/userRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware'); // Import the authMiddleware
const User = require('../models/user');
const router = express.Router();

// Example of a protected route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // Access the user from req.user (set by the authMiddleware)
    const user = await User.findById(req.user.userId); // You can use userId from the token's decoded data

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ name: user.name, email: user.email, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
