// core js module
const path = require('path');

const express = require('express');

// import our controller
const adminController = require('../controllers/admin');

const router = express.Router();

// uses /admin/add-product => GET
// this middleware is called first if passes /add-product filter
router.get('/add-product', adminController.getAddProduct);

// uses /admin/products => GET
// get route to load a new page 
router.get('/products', adminController.getProducts);

// /admin/add-product => POST
// 'post' will filter and only fire when using post requests
router.post('/add-product', adminController.postAddProduct);

// // variable with a dynamic path segment indicated with a column
router.get('/edit-product/:productId', adminController.getEditProduct);
router.post('/edit-product', adminController.postEditProduct);

// // don't need to put anything in the url route since you can use the body
router.post('/delete-product', adminController.postDeleteProduct);

// seperate the exports with different syntax
module.exports = router;