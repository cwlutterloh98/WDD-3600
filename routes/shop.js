// path core module b
const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');
const router = express.Router();


// this is the response
// __direname is the global variable that holds the absolute path on our operating system to this folder
router.get('/', productsController.getProducts);

module.exports = router;