const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find user by email (or username if you prefer)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    // Check if the user is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in." });
    }

    // Generate JWT token (use a secret key from environment variables)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY, // Secret key from .env
      { expiresIn: "1h" } // Expire in 1 hour
    );

    // Send token to the client
    res.status(200).json({
      message: "Login successful.",
      token, // You can include user data in the response if needed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  loginUser,
};
