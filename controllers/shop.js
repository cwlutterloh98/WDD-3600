const Product = require('../models/product');
const Order = require('../models/order')

// Middleware add getProducts for shop.js
exports.getProducts = (req, res, next) => {
    // this gives you all the products
    Product.find()
    .then(products => {
        console.log(products);
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        })
     })
     .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
};

// params object we can access our productId because we used our productId in our routes
// render product detail
exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    // findById is not our own method but defined by mongoose
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    })
    .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
};

exports.getIndex = (req,res,next) => {
     // this gives you all the products
     Product.find()
     .then(products => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        })
     })
     .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
};

// get the cart to output on the cart page
exports.getCart = (req, res, next) => {
    req.user
      .populate('cart.items.productId')
      // populate does not return a promise you have to use execPopulate
      .execPopulate()
      .then(user => {
        const products = user.cart.items;
        res.render('shop/cart', {
          path: '/cart',
          pageTitle: 'Your Cart',
          products: products
        });
      })
      .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
  };

// accepts a post request
exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
        return req.user.addToCart(product);
    }).then(result => {
        console.log(result);
        res.redirect('/cart')
    })
}

// remove item only from the cart not the products
exports.postCartDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    req.user
    .removeFromCart(prodId)
    .then(result=> {
        res.redirect('/cart');
    })
    .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })

};

exports.postOrder = (req, res, next) => {
    // get the products that are in the cart
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
          // _doc method pull out all the data in the document and store it in a new object
          return {quantity: i.quantity, product: {...i.productId._doc}}
      });
      // create new order based on our order model
        const order = new Order({
            // mongoose will automatically pull the userId from the user object
            user: {
                email: req.user.email,
                userId: req.user
            },
            products: products
        });
        // saves the order to the database
        return order.save();
    })
    .then(result => {
        return req.user.clearCart();
    })
    // moved it so that it executes only once the cart is clear
    .then(() => {
        res.redirect('/orders')
    })
    .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
};
exports.getOrders = (req,res,next) => {
    Order.find({"user.userId": req.user._id})
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',        
            pageTitle: 'Your orders',
            orders: orders,
            isAuthenticated: req.session.isLoggedIn
        })
    })
    .catch(err => {
        const error = new Error('Creating a product failed.')
        error.httpStatusCode = 500;
        return next(error);
      })
};
