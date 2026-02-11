/*const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token not found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
*/


const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
            return res.status(401).json({ message: "Access Denied. Please Login first!" });
        }

        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Access Denied. Invalid token format." });
        }

        
        const verified = jwt.verify(token, process.env.SECRET_KEY); 
        
        
        req.user = verified; 
        
        
        next(); 

    } catch (error) {
        return res.status(403).json({ message: "Invalid or Expired Token! Please Login again." });
    }
};

module.exports = authMiddleware;