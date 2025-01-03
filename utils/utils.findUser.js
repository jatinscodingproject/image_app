const sequelize = require('../config/db');
const model = require('../models/index');
const { CustomError } = require('./utlis.error');
const { HttpStatus } = require('./utils.https.status');

async function findUser(id) {
    let t;
    try {
        t = await sequelize.transaction();
        const isUser = await model.User.findByPk(id, { transaction: t });
        if (!isUser) {
            await t.rollback();
            throw new CustomError('User not present', HttpStatus.NOT_FOUND);
        }
        await t.commit()
        return isUser;
    } catch (error) {
        if (t) await t.rollback();
        throw error;
    }
}

module.exports = {
    findUser
};
