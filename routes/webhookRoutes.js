const express = require("express");
const crypto = require("crypto");
const User = require("../models/user"); // Adjust path based on your structure
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
    const { transaction_id, amount_paid, transaction_status, receiver } = req.body;

    if (transaction_status !== "success") {
      console.log("❌ Payment failed, ignoring.");
      return res.status(200).json({ status: "ignored" });
    }

    // ✅ Find user by their virtual account number
    const user = await User.findOne({
      "virtualAccounts.accountNumber": receiver.account_number,
    });

    if (!user) {
      console.log("❌ User not found for account:", receiver.account_number);
      return res.status(404).json({ error: "User not found" });
    }

    // ✅ Update wallet balance
    user.wallet.balance += amount_paid;

    // ✅ Add transaction to wallet history
    user.wallet.transactions.push({
      transactionId: transaction_id,
      amount: amount_paid,
      type: "credit",
      status: "completed",
      timestamp: new Date(),
    });

    await user.save();

    console.log(`✅ Wallet funded: ${amount_paid} for ${user.email}`);

    res.status(200).json({ status: "success" });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
