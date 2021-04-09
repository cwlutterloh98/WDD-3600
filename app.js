// nodejs core modules
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const session = require('express-session');
// have to pass the session to mongodbstore
const MongoDBStore = require('connect-mongodb-session')(session);

// import the error controller
const errorController = require('./controllers/error');

// import the user model
const User = require('./models/user');

// store database connection
const MONGODB_URI = 'mongodb+srv://admin:8gnySvM515BP5ekz@cluster0.vmhsq.mongodb.net/shop'
// setting up express middleware for use
const express = require('express');

const app = express();
// constructor function to pass options
const store = new MongoDBStore({
    uri:  MONGODB_URI,
    collection: 'sessions'
});


// set your view engine
app.set('view engine', 'ejs');

// this is where you use the templating engine
app.set('views', 'views');

// add my own files
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// registers middleware call next at the end parse bodies
app.use(bodyParser.urlencoded({extended: false}));

// registers to serve static files from the public path
app.use(express.static(path.join(__dirname, 'public')));

// register middleware for sessions executing as a function
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store 
}))

app.use((req,res,next) => {
    if (!req.session.user) {
        return next();
    }
    // user is stored in session
    User.findById(req.session.user._id)
      .then(user => {
        // need a mongoose model to work with for cool methods
        req.user = user;
        next();
    })
      .catch(err => console.log(err));
});

// consider the routes in the admin.js and shop.js files
// use filter so only /admin uses
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


// add 404 error handling by calling the controller 
app.use(errorController.get404)

// connect to database using mongoose then start app
mongoose
    .connect(
        MONGODB_URI
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