// controllers/verifyEmailController.js
const nodemailer = require("nodemailer");
const User = require("../models/user");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body; // Assuming the token is sent in the body of a POST request

    // Check if the token exists in the database
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // Mark the user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token after successful verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "An error occurred while verifying the email." });
  }
};

module.exports = { verifyEmail };