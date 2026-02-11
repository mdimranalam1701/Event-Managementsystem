const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Jis vendor ka item order hua hai
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: { type: Number, required: true },
    billingDetails: {
        name: String, 
        email: String, 
        address: String, 
        state: String, 
        pinCode: String, 
        number: String
    },
    paymentMethod: { type: String, enum: ["Cash", "UPI"], required: true },
    status: { type: String, enum: ["Received", "Ready for Shipping", "Out For Delivery"], default: "Received" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);