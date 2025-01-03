const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Page = sequelize.define('Page', {
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
    pageType: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    pageRoute: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = Page;
