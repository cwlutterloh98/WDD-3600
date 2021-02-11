const Product = require('../models/product');

// Middleware for the admin.js
exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
         pageTitle: 'Add Product', 
         path: '/admin/add-product' 
    });
};

// Middleware for admin.js
exports.postAddProduct = (req,res,next) => {
    // models are blueprints
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

// Middleware add getProducts for shop.js
exports.getProducts = (req, res, next) => {
    // this gives you all the products
    Product.fetchAll(products => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        })
    });
};
