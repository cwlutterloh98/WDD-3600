// core js module
const path = require('path');

const express = require('express');

// import our controller
const productsController = require('../controllers/products');

const router = express.Router();

// uses /admin/add-product => GET
// this middleware is called first if passes /add-product filter
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product =? POST
// 'post' will filter and only fire when using post requests
router.post('/add-product', productsController.postAddProduct);


// seperate the exports with different syntax
module.exports = router;