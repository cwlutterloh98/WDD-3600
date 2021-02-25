const Product = require('../models/product');

// Middleware for the edit-product in the admin folder
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
         pageTitle: 'Add Product', 
         path: '/admin/add-product',
         editing: false
    });
};

// Middleware for admin.js
// handles post request when users submit their new product
exports.postAddProduct = (req,res,next) => {
    // models are blueprints
    // create constructor for new product
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(null,title,imageUrl,description,price);
<<<<<<< HEAD
    product
        .save()
        .then(() => {
            res.redirect('/');
    })
    .catch(err=> console.log(err));

=======
    product.save();
    res.redirect('/');
>>>>>>> 5f57f7b574cb2c81bf936c68613b486c5b593c87
};

// To reach this contorl action 
// query paramaters can be used to hold additional information using a key value pair
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode,
            product: product
       });
    })
    
};

// want to construct a new product and replace the existing product with the new one
exports.postEditProduct = (req,res,next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description
    const updatedProduct = new Product(
        prodId,
        updatedTitle, 
        updatedImageUrl, 
        updatedDesc, 
        updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/products')
}

exports.getProducts = (req,res,next) => {
    // this gives you all the products
    Product.fetchAll(products => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        })
    });
}

exports.postDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    Product.deleteById(prodId);
    res.redirect('/admin/products');
}