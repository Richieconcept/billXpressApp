// controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateVerificationToken = require("../utils/generateVerificationToken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, username, email, phoneNumber, password, confirmPassword } = req.body;

    // Validate input
    // ... (input validation)

    // Check for existing user
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email is already in use." });
    }
    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username is already in use." });
    }
    if (await User.findOne({ phoneNumber })) {
      return res.status(400).json({ message: "Phone number is already in use." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token and set expiration (15 minutes)
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires, // 🆕 Add this field
    });

    // Save user to the database
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(newUser, verificationToken);

    res.status(201).json({
      message: "User registered successfully! Check your email to verify your account.",
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      message: "An internal server error occurred. Please try again later.",
    });
  }
};

module.exports = { registerUser };
