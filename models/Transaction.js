const mongoose = require("mongoose");

// Schema for wallet transactions
const transactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to User
});

module.exports = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);
 