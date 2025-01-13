const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const token = sequelize.define('token', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    token: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    expire: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = token;
