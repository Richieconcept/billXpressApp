const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");

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
    verifyEmail
  };
  