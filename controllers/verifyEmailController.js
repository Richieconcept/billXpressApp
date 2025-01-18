const nodemailer = require("nodemailer");

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

module.exports = {
  sendVerificationEmail,
};
