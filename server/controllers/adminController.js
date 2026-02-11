const User = require('../models/userSchema.js');


const getAllUsers = async (req, res) => {
    try {
        
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const updateMembership = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const { membership } = req.body; 

        
        const vendor = await User.findById(vendorId);
        
        if (!vendor) {
            return res.status(404).json({ message: "User not found!" });
        }
        
        if (vendor.role !== 'Vendor') {
            return res.status(403).json({ message: "Only Vendors can have memberships!" });
        }

        
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