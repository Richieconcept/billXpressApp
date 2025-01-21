const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    avatar: {
      type: String,
      default:
        "file:///C:/Users/Hi/Desktop/billExpressProject/billEpressApp/assets/prfileAvatar.png", // Replace with the URL of your default avatar
    },
    verificationToken: {
      type: String, // Stores the unique email verification token
    },
    isVerified: {
      type: Boolean,
      default: false, // Indicates whether the user's email is verified
    },
    // Add these fields for password reset
    passwordResetToken: {
      type: String, // Stores the reset token
    },
    passwordResetExpires: {
      type: Date, // Stores the expiry date and time for the token
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("User", userSchema);
