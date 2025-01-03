const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const UserType = sequelize.define('UserType', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    AccountTypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    RoleName: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = UserType;
