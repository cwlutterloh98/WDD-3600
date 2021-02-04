// nodejs core modules
const path = require('path');
const bodyParser = require('body-parser');

// add custom file in the same file that has the const requestHandler
// const routes = require('./routes');

// setting up express middleware for use
const express = require('express');
const app = express();

// add my own files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// registers middleware call next at the end parse bodies
app.use(bodyParser.urlencoded({extended: false}));

// registers to serve static files from the public path
app.use(express.static(path.join(__dirname, 'public')));

// this is the response
app.use('/',(req, res, next) => {
    next();
});

// consider the routes in the admin.js and shop.js files
// use filter so only /admin uses
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// add 404 error handling by adding a catch all
app.use((req,res,next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
});

// uses express to simplify the start server on port 3000
app.listen(3000);