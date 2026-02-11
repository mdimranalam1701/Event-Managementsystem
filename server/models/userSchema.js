const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Vendor", "User"], default: "User" },
    
    category: { type: String, enum: ["Catering", "Florist", "Decoration", "Lighting"] },
    membership: { type: String, enum: ["6 months", "1 year", "2 years"], default: "6 months" },
    
    cart: [{
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
        quantity: { type: Number, default: 1 }
    }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);