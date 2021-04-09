const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

// Middleware for the edit-product in the admin folder
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
         pageTitle: 'Add Product', 
         path: '/admin/add-product',
         editing: false,
         isAuthenticated: req.session.isLoggedIn
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
    // right side of colon refers to data received in controller action
    // left side refers to the keys in your schema
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        // gives access to user id and assigns it
        userId: req.user
    });
    product
    // .save() is defined by mongoose not us
    .save()
    .then(result => {
        //console.log(result);
        console.log('created product')
        res.redirect('/admin/products');
    })
    .catch(err => {
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
    Product.findById(prodId)
    .then(product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            isAuthenticated: req.session.isLoggedIn
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

    // because of mongoose this is a mongoose object
    // if you call save on an existing object it will save the object by id
    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product
        .save()
    })

    // this returns for the bottom catch log
    .then(result => {
        console.log('updated product')
        // moved so the new values update after update was successful
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
    
}

exports.getProducts = (req,res,next) => {
    // this gives you all the products
    Product.find()
    // select can control which fields are returned
    // .select('title price -_id')
    // utility method to use after find
    // gives you all the data in one step without writing nested data
    // .populate('userId', 'name')
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => console.log(err));
}

exports.postDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    // changed to findByIdAndRemove for mongoose
    Product.findByIdAndRemove(prodId)
    .then(() => {
        console.log('destroyed product');
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
}