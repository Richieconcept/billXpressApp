const User = require("../models/user");
const generateVerificationToken = require("../utils/generateVerificationToken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const resendVerificationToken = async (req, res) => {
  try {
    // Get the user ID from authentication (JWT/session)
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified." });
    }

    // Generate a new OTP and set a new expiration time (e.g., 1 hour)
    const newVerificationToken = generateVerificationToken();
    user.verificationToken = newVerificationToken;
    user.verificationTokenExpires = Date.now() + 60 * 60 * 1000; // 1 hour

    // Save the updated user
    await user.save();

    // Resend the verification email
    await sendVerificationEmail(user, newVerificationToken, "email verification");

    res.status(200).json({ message: "Verification OTP resent successfully!" });
  } catch (error) {
    console.error("Error resending verification OTP:", error);
    res.status(500).json({ message: "An error occurred while resending the OTP." });
  }
};

module.exports = { resendVerificationToken };
