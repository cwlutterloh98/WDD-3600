// nodejs core modules
const path = require('path');
const bodyParser = require('body-parser');

// import the error controller
const errorController = require('./controllers/error');

// import database connection
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

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

// incoming requests only handled by middleware
// store the user you recieve from the database in the req
app.use((req,res,next) => {
    User.findById("60497541071745cb47e67cb9")
    .then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => console.log(err))
})

// consider the routes in the admin.js and shop.js files
// use filter so only /admin uses
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// add 404 error handling by calling the controller 
app.use(errorController.get404)

// start application on port 3000 with database
mongoConnect(() => {
    app.listen(3000)
})