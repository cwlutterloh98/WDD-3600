const Product = require('../models/product');
const Cart = require('../models/cart');

// Middleware add getProducts for shop.js
exports.getProducts = (req, res, next) => {
    // this gives you all the products
<<<<<<< HEAD
    Product.fetchAll()
    .then(([rows, fieldData]) => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop/product-list', {
            prods: rows,
            pageTitle: 'All Products',
            path: '/products'
        })
    })
    .catch(err => console.log(err));
=======
    Product.fetchAll(products => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        })
    });
>>>>>>> 5f57f7b574cb2c81bf936c68613b486c5b593c87
};

// params object we can access our productId because we used our productId in our routes
// render product detail
exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId
<<<<<<< HEAD
    Product.findById(prodId).then(([product]) => {
        res.render('shop/product-detail', {
            product: product[0],
=======
    Product.findById(prodId, product => {
        res.render('shop/product-detail', {
            product: product,
>>>>>>> 5f57f7b574cb2c81bf936c68613b486c5b593c87
            pageTitle: product.title,
            path: '/products'
        });
    })
<<<<<<< HEAD
    .catch(err => console.log(err));
=======
>>>>>>> 5f57f7b574cb2c81bf936c68613b486c5b593c87
}

exports.getIndex = (req,res,next) => {
     // this gives you all the products
<<<<<<< HEAD
     Product.fetchAll()
     // deconstruction
     .then(([rows, fieldData]) => {
        res.render('shop/index', {
            prods: rows,
            pageTitle: 'Shop',
            path: '/'
        })
     })
     .catch(err => console.log(err));

    // use the default templating engine and return that template and pass in data that should be added into our view
    
=======
     Product.fetchAll(products => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        })
    });
>>>>>>> 5f57f7b574cb2c81bf936c68613b486c5b593c87
};

exports.getCart = (req,res,next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts =[];
            // loop though all the products and add the ones that are in the cart
            for (product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id);
                if (cartProductData) {
                    cartProducts.push({productData: product, qty: cartProductData.qty});
                }
            }
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your cart',
                products: cartProducts
            });
        });
    });
};

// accepts a post request
exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    res.redirect('/cart');
}

// remove item only from the cart not the products
exports.postCartDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price)
        res.redirect('/cart');
    });
};

exports.getOrders = (req,res,next) => {
    res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your orders',
    });
};

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    });
};