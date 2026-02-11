const User = require('../models/userSchema.js'); 
const Item = require('../models/productSchema.js'); 
const Guest = require('../models/guestSchema.js');


const getVendorsByCategory = async (req, res) => {
    try {
        const categoryParam = req.params.category;
        
        
        if (!categoryParam) {
            return res.status(400).json({ message: "Category is required" });
        }

        
        const vendors = await User.find({ 
            role: "Vendor", 
            category: categoryParam 
        }).select('-password'); 

        
        if (vendors.length === 0) {
            return res.status(404).json({ message: `No vendors found for category: ${categoryParam}` });
        }

        return res.status(200).json(vendors);

    } catch (error) {
        console.error("Error in getVendorsByCategory:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;

        
        if (!vendorId) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }

        
        const products = await Item.find({ vendorId: vendorId });

        
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this vendor" });
        }

        return res.status(200).json(products);

    } catch (error) {
        console.error("Error in getVendorProducts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const Order = require('../models/orderSchema.js'); 


const placeOrder = async (req, res) => {
    try {
        
        const {
            userId,
            vendorId,
            items, 
            totalAmount,
            billingDetails, 
            paymentMethod
        } = req.body;

        
        if (!userId || !vendorId || !items || items.length === 0 || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: "Incomplete order details. Please check your cart and billing info." });
        }

       
        const newOrder = new Order({
            userId,
            vendorId,
            items,
            totalAmount,
            billingDetails,
            paymentMethod,
            status: "Received" 
        });

        
        const savedOrder = await newOrder.save();

        return res.status(201).json({
            message: "Order placed successfully!",
            orderId: savedOrder._id 
        });

    } catch (error) {
        console.error("Error in placeOrder:", error);
        return res.status(500).json({ error: "Failed to place order. Internal Server Error." });
    }
};


const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        
        const orders = await Order.find({ userId: userId })
                                  .populate('vendorId', 'name email category') 
                                  .sort({ createdAt: -1 }); 

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        return res.status(200).json(orders);

    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const addGuest = async (req, res) => {
    try {
        const { userId, name, contactInfo } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ message: "User ID and Guest Name are required!" });
        }

        const newGuest = new Guest({
            userId,
            name,
            contactInfo 
        });

        const savedGuest = await newGuest.save();
        return res.status(201).json({ message: "Guest added successfully!", guest: savedGuest });

    } catch (error) {
        console.error("Error in addGuest:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getGuests = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const guests = await Guest.find({ userId: userId }).sort({ createdAt: -1 });

        return res.status(200).json(guests);

    } catch (error) {
        console.error("Error in getGuests:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const updateGuest = async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const { name, contactInfo } = req.body;

        const updatedGuest = await Guest.findByIdAndUpdate(
            guestId, 
            { name, contactInfo }, 
            { new: true } 
        );

        if (!updatedGuest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        return res.status(200).json({ message: "Guest updated!", guest: updatedGuest });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const deleteGuest = async (req, res) => {
    try {
        const guestId = req.params.guestId;

        const deletedGuest = await Guest.findByIdAndDelete(guestId);

        if (!deletedGuest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        return res.status(200).json({ message: "Guest deleted successfully!" });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    getVendorsByCategory,
    getVendorProducts,
    placeOrder,
    getUserOrders,
    addGuest,      
    getGuests,     
    updateGuest,   
    deleteGuest    
};