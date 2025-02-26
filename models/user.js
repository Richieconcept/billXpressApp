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
        "file:///C:/Users/Hi/Desktop/billExpressProject/billEpressApp/assets/prfileAvatar.png",
    },

    // 🆕 Email Verification
    verificationToken: {
      type: String, 
    },
    verificationTokenExpires: {
      type: Date, // 🆕 Expiration for the email verification token
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    // 🆕 Password Reset
    passwordResetToken: {
      type: String, 
    },
    passwordResetExpires: {
      type: Date, 
    },

    // 🆕 Virtual Account Information from Monnify
    virtualAccountNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    virtualAccountName: {
      type: String,
    },
    bankName: {
      type: String,
    },

    // 🆕 Wallet Information
    wallet: {
      balance: {
        type: Number,
        default: 0,
      },
      transactions: [
        {
          amount: { type: Number, required: true },
          type: { type: String, enum: ["credit", "debit"], required: true },
          description: { type: String },
          date: { type: Date, default: Date.now },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
