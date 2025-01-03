const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Pageacess = sequelize.define('Pageacess', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    pageName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    AccountTypeID: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    hasAcess: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default:false
    },
    pageRoute:{
        type: Sequelize.STRING,
        allowNull:false
    }
});

module.exports = Pageacess;
