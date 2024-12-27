const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || '12343211223344';


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token.' });
        }
        req.user = decoded; 
        next();
    });
};


const checkRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({ message: 'Access forbidden: insufficient rights.' });
    }
    next();
};

module.exports = { verifyToken, checkRole };
