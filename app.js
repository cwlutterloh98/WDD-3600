// nodejs core modules
const path = require('path');
const bodyParser = require('body-parser');

// import the error controller
const errorController = require('./controllers/error');

// reach out to the database pool
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

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
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})

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

// relate many Products to one User
// cascade means if you delete any user it deletes any related products
Product.belongsTo(User, {
    constraints: true, onDelete: 'CASCADE'
});

// One user has many products
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);

// through tells sequelize where these connections are stored
Cart.belongsToMany(Product, { through: CartItem});
Product.belongsToMany(Cart, { through: CartItem});

// order connection associations
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem});

// the sync method has a look at all the models defined and creates tables for them
sequelize
    .sync()
    .then(result => {
        // console.log(result);
        return User.findByPk(1);
    })
    // if user doesn't exist add test
    .then(user => {
        if (!user) {
            return User.create({ name: 'Max', email: 'test@test.com'});
        }
        return user;
    })
    .then(user => {
        console.log(user);
        return user.createCart();
        
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch (err => {
        console.log(err);
    })

