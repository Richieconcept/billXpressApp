const bcrypt = require("bcrypt");
const User = require("../models/user");

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

    // Create a new user
    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      // No need to add avatar because it's set by default in the schema
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Export registerUser function
module.exports = {
  registerUser,
};
