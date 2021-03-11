// path core module b
const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const router = express.Router();


// this is the response for start 
// __direname is the global variable that holds the absolute path on our operating system to this folder
router.get('/', shopController.getIndex);

// get request for products
router.get('/products', shopController.getProducts);

// get route to display a new page, part of path is products with dynamic route
// colon signals to node.js that this part can be anything
// dynamic segments must go at the end otherwise it won't continue
router.get('/products/:productId', shopController.getProduct);

// // get request for cart
router.get('/cart', shopController.getCart);

// // post request for cart
router.post('/cart', shopController.postCart);

// post request for pressing the delete button on the cart page
router.post('/cart-delete-item', shopController.postCartDeleteProduct)

// // post request for createorder
router.post('/create-order', shopController.postOrder);

// // get request for orders
router.get('/orders', shopController.getOrders);

module.exports = router;