const nodemailer = require("nodemailer");

const sendVerificationEmail = async (user, verificationToken, purpose = "email verification") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Email address from environment variables
        pass: process.env.EMAIL_PASS, // Email password or app-specific password
      },
    });

    let subject, message;
    const BASE_URL = process.env.BASE_URL || 'https://billxpressapp.onrender.com'; // Your live URL

    // Handling the email for password reset
    if (purpose === "reset password") {
      subject = "Reset Your Password";
      message = `
        <p>You requested to reset your password. Use the following link to reset your password:</p>
        <p><a href="${BASE_URL}/reset-password/${verificationToken}">Click here to reset your password</a></p>
        <p>The link expires in 15 minutes. If you did not request this, you can ignore this email.</p>
      `;
    } 
    // Handling the email for user registration
    else if (purpose === "email verification") {
      subject = "Verify Your Email Address";
      message = `
        <p>Thank you for registering! Please use the following 6-digit code to verify your email address:</p>
        <h3>${verificationToken}</h3>
        <p>The code expires in 15 minutes. Please enter this code in the verification form.</p>
        <p>If you did not register for this account, you can ignore this email.</p>
        <p>Click this link to verify your email: <a href="${BASE_URL}/verify-token?token=${verificationToken}">Verify Your Email</a></p>
      `;
    } else {
      throw new Error("Invalid purpose provided.");
    }

    // Prepare the email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject,
      html: message, // HTML formatted message for better visual appeal
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent for ${purpose} to ${user.email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email could not be sent.");
  }
};

module.exports = sendVerificationEmail;
