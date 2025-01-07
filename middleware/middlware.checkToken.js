const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.JWT_SECRET

const checkTokenMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.redirect('/api/404');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/api/404');
    }
};

module.exports = checkTokenMiddleware;
