const User = require('../models/userSchema.js');


const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            
            const user = await User.findById(req.user.userId);

            if (!user) {
                return res.status(404).json({ message: "User not found!" });
            }

            
            if (user.role !== requiredRole) {
                return res.status(403).json({ 
                    message: `Access Denied! Only ${requiredRole} can perform this action.` 
                });
            }

            
            next();

        } catch (error) {
            console.error("Role Check Error:", error);
            return res.status(500).json({ message: "Internal Server Error during role verification" });
        }
    };
};

module.exports = checkRole;