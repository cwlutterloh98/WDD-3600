const Sequelize = require('sequelize');

// import database management pool handled by sequelize
const sequelize = require('../util/database');

// define a model that will be handled by sequelize
const Product = sequelize.define('product', {
    id: {
        // use the constructor version to specify the type and autoincrement
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    // can use sequelize instead of Javascript object
    title: Sequelize.STRING,
    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Product;