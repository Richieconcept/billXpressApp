const nodemailer = require("nodemailer");
const User = require("../models/user"); // Import User model


// Send verification email
const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables for sensitive info
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Your verification code is ${verificationToken}.`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Error sending verification email.");
  }
};



const verifyEmailToken = async (req, res) => {
  const {verificationToken } = req.body; // Extract token from the request body

  try {
    // Find the user with the matching email and token
    const user = await User.findOne({ verificationToken });

    if (!user) {
      return res.status(400).json({ message: "Invalid token or email." });
    }

    // Mark the user as verified and clear the token
    user.isVerified = true;
    user.verificationToken = null; // Clear the token after successful verification
    await user.save();

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error verifying email token:", error);
    res.status(500).json({ message: "Server error." });
  }
};



module.exports = {
  sendVerificationEmail,
  verifyEmailToken,
};
