// controllers/verifyEmailController.js
const User = require("../models/user");

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body; // Assuming the token is sent in the body of a POST request

    // Check if the token exists in the database
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(200).json({ message: "Account is already verified." });
    }

    // Check if the verification token has expired
    if (user.verificationTokenExpires < Date.now()) {
      return res.status(400).json({
        message: "Verification token has expired. Please request a new one.",
      });
    }

    // Mark the user as verified and clear the verification token and expiry
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the token
    user.verificationTokenExpires = undefined; // Clear the expiry date
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({
      message: "An error occurred while verifying the email.",
    });
  }
};

module.exports = { verifyEmail };
