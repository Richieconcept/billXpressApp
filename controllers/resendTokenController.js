// controllers/resendTokenController.js
const User = require("../models/user");
const generateVerificationToken = require("../utils/generateVerificationToken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const resendVerificationToken = async (req, res) => {
  try {
    const { email } = req.body; // Get email from the request body

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Generate a new verification token
    const newVerificationToken = generateVerificationToken();

    // Update the user's verification token and save to the database
    user.verificationToken = newVerificationToken;
    await user.save();

    // Resend the verification email
    await sendVerificationEmail(user, newVerificationToken, "email verification");

    res.status(200).json({ message: "Verification token resent successfully!" });
  } catch (error) {
    console.error("Error during resending verification token:", error);
    res.status(500).json({ message: "An error occurred while resending the verification token." });
  }
};

module.exports = { resendVerificationToken };
