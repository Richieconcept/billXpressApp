const mongoose = require("mongoose");

const VirtualAccountSchema = new mongoose.Schema({
  accountNumber: { type: String, required: true },
  accountName: { type: String, required: true },
  bankName: { type: String, required: true },
  reservedAccountId: { type: String, required: true }, // Useful for future API calls
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phoneNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "default-avatar.png" },

    // Email Verification
    verificationToken: String,
    verificationTokenExpires: Date,
    isVerified: { type: Boolean, default: false },

    // Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Virtual Accounts (Multiple Payment Gateways)
    virtualAccounts: [VirtualAccountSchema],

    // Wallet Information
    wallet: {
      balance: { type: Number, default: 0 },
      transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
