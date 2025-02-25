// controllers/userController.js
const User = require("../models/user");

// Get user profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password field
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
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
            message: `${user.username} profile updated successfully`,
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

module.exports = { getProfile, updateProfile, deleteAccount };
