// core js module
const path = require('path');

const express = require('express');
const {body} = require('express-validator/check');

// import our controller
const adminController = require('../controllers/admin');

// requests travel through controllers left to right
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// uses /admin/add-product => GET
// this middleware is called first if passes /add-product filter
router.get('/add-product', isAuth, adminController.getAddProduct);

// uses /admin/products => GET
// get route to load a new page 
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
// 'post' will filter and only fire when using post requests
router.post('/add-product', isAuth, [
    // validate our products
    body('title')
        .isString()
        .isLength({min: 3})
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 5, max: 400})
        .trim(),
],
adminController.postAddProduct);

// // variable with a dynamic path segment indicated with a column
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', isAuth,
[
    // same as the addproducts
    body('title')
        .isString()
        .isLength({min: 3})
        .trim(),
    body('imageUrl')
        .isURL(),
    body('price')
        .isFloat(),
    body('description')
        .isLength({min: 5, max: 400})
        .trim(),
],
adminController.postEditProduct);

// // don't need to put anything in the url route since you can use the body
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

// seperate the exports with different syntax
module.exports = router;