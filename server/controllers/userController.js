const bcrypt = require('bcrypt');
const User = require('../models/userSchema.js');
const { createNewToken } = require('../utils/token.js');

const customerRegister = async (req, res) => {
    try {
        const existingUserByEmail = await User.findOne({ email: req.body.email });
        if (existingUserByEmail) {
            return res.status(400).json({ message: 'Email already exists!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const user = new User({
            ...req.body,
            password: hashedPass
        });

        let result = await user.save();
        result.password = undefined; 
        
        const token = createNewToken(result._id);

        return res.status(201).json({
            ...result._doc,
            token: token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

const customerLogIn = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        let user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validated = await bcrypt.compare(req.body.password, user.password);
        
        if (!validated) {
            return res.status(401).json({ message: "Invalid password" });
        }

        user.password = undefined; 
        const token = createNewToken(user._id);

        return res.status(200).json({
            ...user._doc,
            token: token
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};

module.exports = {
    customerRegister,
    customerLogIn,
};