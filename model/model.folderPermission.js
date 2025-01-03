const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const FolderPermission = sequelize.define('FolderPermission', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    parentname:{
        type: Sequelize.STRING,
        allowNull:false
    },
    foldername: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    folderpath: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    hasAccess:{
        type: Sequelize.BOOLEAN,
        allowNull : false
    },
    Username: {
        type: Sequelize.STRING,
        allowNull: false,
    }
}, {
    timestamps: true,
});

module.exports = FolderPermission;
