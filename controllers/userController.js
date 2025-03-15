// controllers/userController.js
const User = require("../models/user");


const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select("-password")
            .populate({
                path: "virtualAccounts",
                select: "accountNumber bankName accountName status", // ✅ Populate Virtual Accounts
            })
            .populate({
                path: "wallet.transactions",
                select: "amount type description status date", // ✅ Populate Transaction History
                options: { sort: { date: -1 } }, // Sort transactions (latest first)
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Build a structured response including wallet, transactions, and virtual accounts
        res.status(200).json({
            name: user.name,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            isVerified: user.isVerified,
            wallet: {
                balance: user.wallet?.balance || 0,  // ✅ Wallet Balance
                transactions: user.wallet?.transactions.map((tx) => ({
                    amount: tx.amount,
                    type: tx.type,
                    description: tx.description,
                    status: tx.status,
                    date: tx.date,
                })) || [], // ✅ Transaction History
            },
            virtualAccounts: user.virtualAccounts.map((account) => ({
                accountNumber: account.accountNumber,
                bankName: account.bankName,
                accountName: account.accountName,
                status: account.status,
            })),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });

    } catch (error) {
        console.error("❌ Error fetching user profile:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, email, phone } = req.body;

        // Dynamically build the update object
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (phone) updates.phone = phone;

        // Check if there are any valid fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided for update" });
        }

        // Find and update the user
        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Success response with a custom message
        res.status(200).json({
            message: `${user.username}" profile updated successfully"`,
            user
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// Delete user account
const deleteAccount = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Fetch User with Virtual Accounts & Transactions
const getUserWithVirtualAccounts = async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user along with populated virtual accounts & transactions
        const user = await User.findById(userId)
            .select("-password")
            .populate({
                path: "virtualAccounts",
                select: "accountNumber bankName accountName status", // ✅ Populate Virtual Accounts
            })
            .populate({
                path: "wallet.transactions",
                select: "amount type description status date", // ✅ Populate Transaction History
                options: { sort: { date: -1 } }, // Sort transactions (latest first)
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Build a structured response with wallet & transactions
        const response = {
            name: user.name,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
            isVerified: user.isVerified,
            wallet: {
                balance: user.wallet?.balance || 0,  // ✅ Wallet Balance
                transactions: user.wallet?.transactions.map((tx) => ({
                    amount: tx.amount,
                    type: tx.type,
                    description: tx.description,
                    status: tx.status,
                    date: tx.date,
                })) || [], // ✅ Transaction History
            },
            virtualAccounts: user.virtualAccounts.map((account) => ({
                accountNumber: account.accountNumber,
                bankName: account.bankName,
                accountName: account.accountName,
                status: account.status,
            })),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        console.log("User with Virtual Accounts & Transactions:", response);
        res.status(200).json(response);

    } catch (error) {
        console.error("❌ Error fetching user with virtual accounts and transactions:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = { getProfile, updateProfile, deleteAccount, getUserWithVirtualAccounts };