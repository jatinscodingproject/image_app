const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const subFolder = sequelize.define('subFolder', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    parentname: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    path: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = subFolder;
