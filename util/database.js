const Sequelize = require('sequelize');

// uses constructor function to create database connection
const sequelize = new Sequelize('node-complete', 'root','root', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
