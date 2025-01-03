const Sequelize = require('sequelize')
require('dotenv').config()

const host = process.env.db_host
const db_name = process.env.db_name
const db_user = process.env.db_user
const db_password = process.env.db_password

const sequelize = new Sequelize(db_name,db_user,db_password,{
    host:host,
    dialect:'mysql',
    logging:false
})

module.exports = sequelize