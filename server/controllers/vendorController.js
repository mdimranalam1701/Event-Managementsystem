const Item = require('../models/productSchema.js');
const Order = require('../models/orderSchema.js');
const { uploadOnCloudinary } = require('../utils/cloudinary.js');


const addItem = async (req, res) => {
    try {
        const { vendorId, name, price } = req.body;

        if (!vendorId || !name || !price) {
            return res.status(400).json({ message: "Vendor ID, Product Name, and Price are required!" });
        }

        
        const imageLocalPath = req.file?.path;

        if (!imageLocalPath) {
            return res.status(400).json({ message: "Product Image is required!" });
        }

        
        const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);

        if (!cloudinaryResponse) {
            return res.status(500).json({ message: "Failed to upload image on Cloudinary" });
        }

       
        const newItem = new Item({ 
            vendorId, 
            name, 
            price, 
            image: cloudinaryResponse.url 
        });

        const savedItem = await newItem.save();

        return res.status(201).json({ message: "Product added successfully!", item: savedItem });

    } catch (error) {
        console.error("Error adding item:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getVendorItems = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        const items = await Item.find({ vendorId: vendorId }).sort({ createdAt: -1 });
        return res.status(200).json(items);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


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


const getVendorTransactions = async (req, res) => {
    try {
        const vendorId = req.params.vendorId;
        
        const orders = await Order.find({ vendorId: vendorId })
                                  .populate('userId', 'name email') 
                                  .sort({ createdAt: -1 });

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body; 

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