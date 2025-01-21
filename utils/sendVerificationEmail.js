
const nodemailer = require("nodemailer");

const sendVerificationEmail = async (user, verificationToken, purpose = "email verification") => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: purpose === "reset password" ? "Reset Your Password" : "Verify Your Email",
        text: purpose === "reset password" 
          ? `Use the following code to reset your password: ${verificationToken}. The code expires in 15 minutes.`
          : `Please click the following link to verify your email: http://localhost:5000/verify-token?token=${verificationToken}`,
      };
  
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
    }
  };
  
  module.exports = sendVerificationEmail;
  