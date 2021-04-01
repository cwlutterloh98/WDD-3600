// nodejs core modules
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import the error controller
const errorController = require('./controllers/error');

// import the user model
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
    // mongoose findById
    User.findById("6064f211477d333588f9e3cf")
    .then(user => {
        req.user = user;
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

// connect to database using mongoose then start app
mongoose
    .connect(
        'mongodb+srv://admin:8gnySvM515BP5ekz@cluster0.vmhsq.mongodb.net/shop?retryWrites=true&w=majority'
    )
    .then(result => {
        User.findOne().then(user => {
            // only if user is undefined not set
            if (!user) {
                // create user here
                const user = new User({
                    name: 'Max',
                    email: 'max@test.com',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        });
        app.listen(3000);
    }).catch(err => {
        console.log(err);
    });