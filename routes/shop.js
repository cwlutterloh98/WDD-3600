// path core module b
const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');

// import our middleware that checks login
const isAuth = require('../middleware/is-auth');

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
router.get('/cart', isAuth, shopController.getCart);

// // post request for cart
router.post('/cart', isAuth, shopController.postCart);

// post request for pressing the delete button on the cart page
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct)

// // post request for createorder
router.post('/create-order', isAuth, shopController.postOrder);

// // get request for orders
router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;