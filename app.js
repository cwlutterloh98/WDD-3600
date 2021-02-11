// nodejs core modules
const path = require('path');
const bodyParser = require('body-parser');

// import the error controller
const errorController = require('./controllers/error');

// add custom file in the same file that has the const requestHandler
// const routes = require('./routes');

// setting up express middleware for use
const express = require('express');

const app = express();

// set your view engine
app.set('view engine', 'ejs');

// this is where you use the templating engine
app.set('views', 'views');

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

// add 404 error handling by calling the controller 
app.use(errorController.get404)

// uses express to simplify the start server on port 3000
app.listen(3000);