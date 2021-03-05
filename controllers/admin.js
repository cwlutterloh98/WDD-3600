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
    // automatically creates a connected model
    req.user
    .createProduct({
        // right side refers to const left side refers to model
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user.id
    })
    .then(result => {
        //console.log(result);
        console.log('created product')
        res.redirect('/admin/products');
    }).catch(err => {
        console.log(err);
    });
};

// To reach this contorl action 
// query paramaters can be used to hold additional information using a key value pair
exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/')
    }
    const prodId = req.params.productId;
    req.user
    .getProducts({where: {id: prodId}})
    // changed to findbypk
    .then(products => {
        const product = products[0];
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
    .catch(err => console.log(err))
    
};

// want to construct a new product and replace the existing product with the new one
exports.postEditProduct = (req,res,next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description
    Product.findByPk(prodId)
    .then(product => {
        product.title= updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;

        // takes the product as we edited and saves to data base
        return product.save();
    })
    // this affects return so the bottom catch log catches both promises
    .then(result => {
        console.log('updated product')
        // moved so the new values update after update was successful
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
    
}

exports.getProducts = (req,res,next) => {
    // this gives you all the products
    req.user
    .getProducts()
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products'
        });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    // changed to findbypk 
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        console.log('destroyed product');
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
}