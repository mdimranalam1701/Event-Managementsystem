const User = require('../models/userSchema.js');

// Yeh ek dynamic guard hai. Isko hum jo bhi role pass karenge (Admin, Vendor, User), yeh wahi check karega.
const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            // authMiddleware ne hume token verify karke req.user.userId de diya tha
            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            // Asli Check: Agar user ka role required role se match nahi karta!
            if (user.role !== requiredRole) {
                return res.status(403).json({ 
                    message: `Access Denied! Only ${requiredRole} can perform this action.` 
                });
            }

            // Agar role match ho gaya, toh request aage controller ke paas jane do
            next();

        } catch (error) {
            console.error("Role Check Error:", error);
            return res.status(500).json({ message: "Internal Server Error during role verification" });
        }
    };
};

module.exports = checkRole;