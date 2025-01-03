const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
    UserId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    Username:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    FName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    LName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    generatedEmailOtp: {
        type: Sequelize.STRING,
    },
    isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    createdBy: {
        type: Sequelize.STRING
    },
    isActive:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    isConfirmed:{
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    },
    AccountTypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    isPasswordChange: {
        type: Sequelize.BOOLEAN
    }
}, {
    timestamps: true,
});

module.exports = User;
