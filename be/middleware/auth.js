const jwt = require('jsonwebtoken');
require('dotenv').config();

// this middleware checks if the user is logged in
// it looks for a JWT token in the request header
// if valid, it attaches the user info to req.user so routes can use it

const authenticateUser = (req, res, next) => {
    // get the token from the 'Authorization' header
    // format is: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'no token provided, please login first' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // verify the token using our secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'amazon_clone_super_secret_for_evaluators');

        // attach user data to the request object
        // now any route handler can access req.user.id, req.user.email etc
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'invalid or expired token, please login again' });
    }
};

module.exports = authenticateUser;
