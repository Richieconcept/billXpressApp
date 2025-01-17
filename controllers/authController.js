const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");

// Generate a 6-digit numeric verification token
const generateVerificationToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit token
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, username, email, phoneNumber, password, confirmPassword } = req.body;

    // Validate input
    if (!name || !username || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check for existing user and specify conflict
const existingEmail = await User.findOne({ email });
if (existingEmail) {
  return res.status(400).json({ errors: { email: "Email is already in use." } });
}

const existingUsername = await User.findOne({ username });
if (existingUsername) {
  return res.status(400).json({ errors: { username: "Username is already in use." } });
}

const existingPhoneNumber = await User.findOne({ phoneNumber });
if (existingPhoneNumber) {
  return res.status(400).json({ errors: { phoneNumber: "Phone number is already in use." } });
}

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit verification token
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationToken,
    });

    // Save user to the database
    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({ message: "User registered successfully! Check your email to verify your account." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};


module.exports = {
  registerUser
};
