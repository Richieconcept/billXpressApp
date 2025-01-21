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

    // Handling the email for password reset with a link
    if (purpose === "reset password") {
      subject = "Reset Your Password";
      message = `
        <p>You requested to reset your password. Click the link below to reset your password:</p>
        <a href="http://localhost:5000/reset-password/${verificationToken}">Reset Password</a>
        <p>The link will expire in 15 minutes. If you did not request this, you can ignore this email.</p>
      `;
    } 
    // Handling the email for user registration verification
    else if (purpose === "email verification") {
      subject = "Verify Your Email Address";
      message = `
        <p>Thank you for registering! Please use the following 6-digit code to verify your email address:</p>
        <h3>${verificationToken}</h3>
        <p>The code expires in 15 minutes. Please enter this code in the verification form.</p>
        <p>If you did not register for this account, you can ignore this email.</p>
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
