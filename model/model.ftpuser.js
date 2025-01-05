const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const ftpuser = sequelize.define('ftpuser', {
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
    foldername: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    ftpuser: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = ftpuser;
