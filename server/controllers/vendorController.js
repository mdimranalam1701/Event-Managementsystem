const Item = require('../models/productSchema.js');
const Order = require('../models/orderSchema.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');

// 1. ADD NEW ITEM (Vendor apna naya product add karega)
// 1. ADD NEW ITEM (WITH CLOUDINARY)
const addItem = async (req, res) => {
    try {
        const { vendorId, name, price } = req.body;

        if (!vendorId || !name || !price) {
            return res.status(400).json({ message: "Vendor ID, Product Name, and Price are required!" });
        }

        // Multer ne image file req.file mein save kar di hogi
        const imageLocalPath = req.file?.path;

        if (!imageLocalPath) {
            return res.status(400).json({ message: "Product Image is required!" });
        }

        // Image ko Cloudinary par bhejo
        const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);

        if (!cloudinaryResponse) {
            return res.status(500).json({ message: "Failed to upload image on Cloudinary" });
        }

        // Naya item banao aur Cloudinary ka URL save karo
        const newItem = new Item({ 
            vendorId, 
            name, 
            price, 
            image: cloudinaryResponse.url // Yeh secure URL MongoDB mein save ho jayega
        });

        const savedItem = await newItem.save();

        return res.status(201).json({ message: "Product added successfully!", item: savedItem });

    } catch (error) {
        console.error("Error adding item:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 2. GET YOUR ITEMS (Vendor apne daale hue saare items dekhega)
const getVendorItems = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const items = await Item.find({ vendorId: vendorId }).sort({ createdAt: -1 });
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 3. UPDATE ITEM (Product ka naam, price ya image change karna)
const updateItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const { name, price, image } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            itemId, 
            { name, price, image }, 
            { new: true }
        );

        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        return res.status(200).json({ message: "Product updated!", item: updatedItem });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 4. DELETE ITEM (Product ko delete karna)
const deleteItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        const deletedItem = await Item.findByIdAndDelete(itemId);

        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        return res.status(200).json({ message: "Product deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 5. GET TRANSACTIONS/ORDERS (Vendor apne paas aaye hue orders dekhega)
const getVendorTransactions = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        // User ki details bhi nikal lenge taaki vendor ko pata chale kisne order kiya hai
        const orders = await Order.find({ vendorId: vendorId })
                                  .populate('userId', 'name email') 
                                  .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// 6. UPDATE ORDER STATUS (Radio button se status change karna)
const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body; // "Received", "Ready for Shipping", "Out For Delivery"

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId, 
            { status: status }, 
            { new: true }
        );

        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json({ message: "Order status updated!", order: updatedOrder });
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    addItem,
    getVendorItems,
    updateItem,
    deleteItem,
    getVendorTransactions,
    updateOrderStatus
};