// core js module
const path = require('path');

const express = require('express');

// import our root directory path
const rootDir = require('../util/path');

const router = express.Router();

// uses /admin/add-product => GET
// this middleware is called first if passes /add-product filter
router.get('/add-product',(req, res, next) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'))
});

// /admin/add-product =? POST
// 'post' will filter and only fire when using post requests
router.post('/add-product',(req,res,next) => {
    console.log(req.body);
    res.redirect('/');
})
module.exports = router;