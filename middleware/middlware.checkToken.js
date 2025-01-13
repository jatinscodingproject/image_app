const jwt = require('jsonwebtoken');
require('dotenv').config();
const model = require('../model/index')
const secret = process.env.JWT_SECRET

const checkTokenMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.redirect('/api/404');
    }

    const token = authHeader.split(' ')[1];
    try {
        
        const blacklistedToken = await model.token.findOne({ where: { Createdtoken : token } });
        if (blacklistedToken && blacklistedToken.expire === true) {
            return res.redirect('/api/404');
        }
        
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.redirect('/api/404');
    }
};

module.exports = checkTokenMiddleware;
