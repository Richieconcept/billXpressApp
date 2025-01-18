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




// Verify email token
const verifyEmailToken = async (req, res) => {
  const { email, verificationToken } = req.body;

  try {
    // Check if the user exists and the token matches
    const user = await User.findOne({ email, verificationToken });

    if (!user) {
      return res.status(400).json({ message: "Invalid token or email." });
    }

    // If the token is valid, mark the user as verified
    user.isVerified = true;
    user.verificationToken = null; // Remove the token after successful verification
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
