const jwt = require('jsonwebtoken');
const model = require('../model/index')

const generateSecretTokenUser = (id) => {
    const token = jwt.sign({ userId: id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    return token;
};


module.exports = {
    generateSecretTokenUser
}