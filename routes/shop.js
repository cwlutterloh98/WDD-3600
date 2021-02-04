// path core module b
const path = require('path');

// import root directory
const rootDir = require('../util/path');

const express = require('express');

const router = express.Router();

// this is the response
// __direname is the global variable that holds the absolute path on our operating system to this folder
router.get('/',(req, res, next) => {
    // go into route folder up one folder into a folder called views and to shop.html
    res.sendFile(path.join(rootDir,'views', 'shop.html'))
});

module.exports = router;