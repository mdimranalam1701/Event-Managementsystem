const User = require('../models/userSchema.js');

// 1. Get all Users and Vendors (List dikhane ke liye)
const getAllUsers = async (req, res) => {
    try {
        // Password frontend pe nahi bhejna hai isliye .select('-password') lagaya hai
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 2. Update Vendor Membership (Rules ke hisaab se)
const updateMembership = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const { membership } = req.body; // Frontend se "6 months", "1 year" ya "2 years" aayega

        // Pehle check karo user exist karta hai ya nahi aur kya wo sach mein vendor hai
        const vendor = await User.findById(vendorId);
        
        if (!vendor) {
            return res.status(404).json({ message: "User not found!" });
        }
        
        if (vendor.role !== 'Vendor') {
            return res.status(403).json({ message: "Only Vendors can have memberships!" });
        }

        // Membership update karke save kar do
        vendor.membership = membership;
        await vendor.save();

        return res.status(200).json({ 
            message: `Membership successfully updated to ${membership}!`, 
            vendor 
        });
    } catch (error) {
        console.error("Error in updateMembership:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { 
    getAllUsers, 
    updateMembership 
};