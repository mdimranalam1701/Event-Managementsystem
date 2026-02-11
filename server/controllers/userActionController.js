const User = require('../models/userSchema.js'); 
const Item = require('../models/productSchema.js'); 
const Guest = require('../models/guestSchema.js');


const getVendorsByCategory = async (req, res) => {
    try {
        const categoryParam = req.params.category;
        
        // Validation: Ensure category is provided
        if (!categoryParam) {
            return res.status(400).json({ message: "Category is required" });
        }

        // Database Query: 
        // 1. role "Vendor" hona chahiye.
        // 2. category match karni chahiye (Catering, Florist, etc.)
        const vendors = await User.find({ 
            role: "Vendor", 
            category: categoryParam 
        }).select('-password'); // Password frontend par nahi bhejna chahiye (Security)

        // Agar koi vendor nahi mila
        if (vendors.length === 0) {
            return res.status(404).json({ message: `No vendors found for category: ${categoryParam}` });
        }

        return res.status(200).json(vendors);

    } catch (error) {
        console.error("Error in getVendorsByCategory:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 2. Kisi specific vendor par click karne par uske items (products) lana
const getVendorProducts = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;

        // Validation: Check if vendorId is provided
        if (!vendorId) {
            return res.status(400).json({ message: "Vendor ID is required" });
        }

        // Database Query:
        // Item table (productSchema) mein un sabhi products ko dhundo jinka vendorId is vendorId se match kare.
        const products = await Item.find({ vendorId: vendorId });

        // Agar vendor ne abhi tak koi item add nahi kiya hai
        if (products.length === 0) {
            return res.status(404).json({ message: "No products found for this vendor" });
        }

        return res.status(200).json(products);

    } catch (error) {
        console.error("Error in getVendorProducts:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Dhyan rakhna uper Item, User, aur Order model import ho chuke hain
const Order = require('../models/orderSchema.js'); 

// 3. Checkout Page: User "Order Now" pe click karega toh Order save hoga
const placeOrder = async (req, res) => {
    try {
        // Frontend (React) se ye saara data payload mein aayega
        const {
            userId,
            vendorId,
            items, // Array of objects [{name: "Stage", price: 5000, quantity: 1}]
            totalAmount,
            billingDetails, // Object {name, email, address, state, pinCode, number}
            paymentMethod
        } = req.body;

        // Basic validation: Check karo ki zaroori cheezein aayi hain ya nahi
        if (!userId || !vendorId || !items || items.length === 0 || !totalAmount || !paymentMethod) {
            return res.status(400).json({ message: "Incomplete order details. Please check your cart and billing info." });
        }

        // Naya order create karo
        const newOrder = new Order({
            userId,
            vendorId,
            items,
            totalAmount,
            billingDetails,
            paymentMethod,
            status: "Received" // Default status as per flowchart
        });

        // Database mein save karo
        const savedOrder = await newOrder.save();

        return res.status(201).json({
            message: "Order placed successfully!",
            orderId: savedOrder._id // Frontend ko confirmation ke liye bhejna achha rehta hai
        });

    } catch (error) {
        console.error("Error in placeOrder:", error);
        return res.status(500).json({ error: "Failed to place order. Internal Server Error." });
    }
};

// 4. Order Status Page: User ko uske pichle saare orders dikhana
const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Database se us user ke saare orders nikalo.
        // `.populate` bohot zaroori hai! Isse hume vendor ka naam bhi mil jayega UI pe dikhane ke liye (Vendor table se)
        const orders = await Order.find({ userId: userId })
                                  .populate('vendorId', 'name email category') 
                                  .sort({ createdAt: -1 }); // Latest order sabse upar aayega

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        return res.status(200).json(orders);

    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 5. Naya Guest Add karna
const addGuest = async (req, res) => {
    try {
        const { userId, name, contactInfo } = req.body;

        if (!userId || !name) {
            return res.status(400).json({ message: "User ID and Guest Name are required!" });
        }

        const newGuest = new Guest({
            userId,
            name,
            contactInfo // Email ya phone jo bhi aaye
        });

        const savedGuest = await newGuest.save();
        return res.status(201).json({ message: "Guest added successfully!", guest: savedGuest });

    } catch (error) {
        console.error("Error in addGuest:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 6. User ke saare Guests ki list fetch karna
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

// 7. Kisi Guest ko Update karna (Flowchart requirement)
const updateGuest = async (req, res) => {
    try {
        const guestId = req.params.guestId;
        const { name, contactInfo } = req.body;

        const updatedGuest = await Guest.findByIdAndUpdate(
            guestId, 
            { name, contactInfo }, 
            { new: true } // Update hone ke baad naya data return karega
        );

        if (!updatedGuest) {
            return res.status(404).json({ message: "Guest not found" });
        }

        return res.status(200).json({ message: "Guest updated!", guest: updatedGuest });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 8. Kisi Guest ko Delete karna (Flowchart requirement)
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

// Dono naye functions ko exports mein daal do (Pehle walo ke sath mila kar)
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