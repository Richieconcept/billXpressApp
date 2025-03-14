const bcrypt = require("bcrypt");
const User = require("../models/user");
const generateVerificationToken = require("../utils/generateVerificationToken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const createVirtualAccount = require("../services/createpaymentpointsVirtualAccount");

const registerUser = async (req, res) => {
  try {
    const { name, username, email, phoneNumber, password } = req.body;

    // Check for existing user
    if (await User.findOne({ email })) return res.status(400).json({ message: "Email already in use." });
    if (await User.findOne({ username })) return res.status(400).json({ message: "Username already in use." });
    if (await User.findOne({ phoneNumber })) return res.status(400).json({ message: "Phone number already in use." });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email verification token
    const verificationToken = generateVerificationToken();
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
    });

    await newUser.save();
    console.log("✅ User Created:", newUser._id);

    // Send verification email
    await sendVerificationEmail(newUser, verificationToken);

    try {
        const virtualAccount = await createVirtualAccount(name, email, phoneNumber, newUser._id.toString());
    
        console.log("✅ Virtual Account Response:", virtualAccount); // Debugging line
    
        // 🔗 Save virtual account details in user document
        newUser.virtualAccounts.push({
            reservedAccountId: virtualAccount.reservedAccountId || virtualAccount.accountNumber, // Adjust based on response
            accountNumber: virtualAccount.accountNumber,
            accountName: virtualAccount.accountName,
            bankName: virtualAccount.bankName,
        });
    
        await newUser.save();
        console.log("✅ User updated with virtual account info");
    } catch (error) {
        console.error("❌ Virtual Account Error:", error.message);
    }

    res.status(201).json({ message: "User registered successfully! Check your email to verify your account." });
  } catch (error) {
    console.error("❌ Server Error:", error.message);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};

module.exports = { registerUser };
