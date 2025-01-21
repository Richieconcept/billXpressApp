const User = require("../models/user");
const generateVerificationToken = require("../utils/generateVerificationToken");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found." });
    }

    // Generate a 6-digit reset token
    const resetToken = generateVerificationToken(); // Assume this generates a 6-digit token
    const tokenExpiry = Date.now() + 15 * 60 * 1000; // Token expires in 15 minutes

    // Save the token and expiry to the user's record
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = tokenExpiry;
    await user.save();

    // Send the reset token via email
    await sendVerificationEmail(user, resetToken, "reset password");

    res.status(200).json({ message: "Reset token sent to your email." });
  } catch (error) {
    console.error("Error during password reset request:", error);
    res.status(500).json({ message: "An error occurred while requesting password reset." });
  }
};

module.exports = { requestPasswordReset };
