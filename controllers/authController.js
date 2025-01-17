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

    // Check if all fields are provided
    if (!name || !username || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Check if email, username, or phone number is already taken
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email, username, or phone number already in use." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a numeric verification token
    const verificationToken = generateVerificationToken();

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationToken,  // Store the 6-digit verification token
    });

    // Save the user to the database
    await newUser.save();

    // Send verification email with the token
    const verificationLink = `http://localhost:5000/api/v1/auth/verify/${verificationToken}`;
    await sendVerificationEmail(email, verificationLink);

    res.status(201).json({ message: "User registered successfully! Check your email to verify your account." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find the user by the verification token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token." });
    }

    // Mark the user as verified and clear the token
    user.verificationToken = null;  // Clear the token after successful verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Send Verification Email
const sendVerificationEmail = async (email, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "no-reply@yourdomain.com",
      to: email,
      subject: "Verify your email",
      html: `<p>Please verify your email by entering the following code:</p>
             <p><strong>${link}</strong></p>
             <p>If you did not register, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email.");
  }
};

module.exports = {
  registerUser,
  verifyEmail,
};
