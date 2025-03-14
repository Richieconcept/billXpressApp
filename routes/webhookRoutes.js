const express = require("express");
const crypto = require("crypto");
const User = require("../models/user");
const Transaction = require("../models/Transaction"); // Import Transaction model
const router = express.Router();

const PAYMENTPOINT_SECRET = process.env.PAYMENTPOINT_API_SECRET;

// Webhook endpoint
router.post("/webhook", async (req, res) => {
  try {
    // Get raw JSON body
    const webhookData = JSON.stringify(req.body);
    const receivedSignature = req.headers["paymentpoint-signature"];

    // Recreate the hash using your secret key
    const calculatedSignature = crypto
      .createHmac("sha256", PAYMENTPOINT_SECRET)
      .update(webhookData)
      .digest("hex");

    // Verify signature
    if (calculatedSignature !== receivedSignature) {
      console.log("❌ Invalid signature, possible fraud attempt.");
      return res.status(400).json({ error: "Invalid signature" });
    }

    // ✅ Signature is valid, process the webhook
    const { transaction_id, amount_paid, amount_received, transaction_status, receiver, fee } = req.body;

    if (transaction_status !== "success") {
      console.log("❌ Payment failed, ignoring.");
      return res.status(200).json({ status: "ignored" });
    }

    // ✅ Prevent duplicate transactions
    const existingTransaction = await Transaction.findOne({ transactionId: transaction_id });

    if (existingTransaction) {
      console.log(`⚠️ Duplicate transaction detected: ${transaction_id}`);
      return res.status(200).json({ status: "duplicate_transaction_ignored" });
    }

    // ✅ Find user by their virtual account number
    const user = await User.findOne({
      "virtualAccounts.accountNumber": receiver.account_number,
    });

    if (!user) {
      console.log("❌ User not found for account:", receiver.account_number);
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Ensure user gets only the received amount (after fee deduction)
    const actualAmountReceived = parseFloat(amount_received) || parseFloat(amount_paid); 
    const feesDeducted = fee ? parseFloat(fee) : 0; 

    // ✅ Update wallet balance
    user.wallet.balance += actualAmountReceived;

    // ✅ Create & save transaction in the Transaction model
    const newTransaction = new Transaction({
      transactionId: transaction_id,
      amount: actualAmountReceived, // Store the actual credited amount
      type: "credit",
      description: "Wallet funding via virtual account",
      feesDeducted, // Store transaction fee for future reference
      date: new Date(),
      user: user._id, // Link transaction to user
    });

    await newTransaction.save();

    // ✅ Store transaction reference in user document
    user.wallet.transactions.push(newTransaction._id);

    await user.save();

    console.log(`✅ Wallet funded: ₦${actualAmountReceived} for ${user.email}`);

    res.status(200).json({
      status: "success",
      message: `Wallet credited with ₦${actualAmountReceived}`,
      newBalance: user.wallet.balance,
      transaction: newTransaction, // Return transaction details for tracking
    });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
