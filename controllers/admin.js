const { validationResult } = require('express-validator/check')
const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

// Middleware for the edit-product in the admin folder
exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
         pageTitle: 'Add Product', 
         path: '/admin/add-product',
         editing: false,
         hasError: false,
         errorMessage: null,
         validationErrors: []

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

    // collect errors
    const errors = validationResult(req);

    // if there are errors
    if (!errors.isEmpty()) {
        // return otherwise you continue with the rest of your code
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product', 
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            // this should set up our displayed error message
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
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
            hasError: false,
            errorMessage: null,
            validationErrors: []
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

    // collect errors
    const errors = validationResult(req);

    // if there are errors
    if (!errors.isEmpty()) {
        console.log(errors.array())

        // return otherwise you continue with the rest of your code
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            // this should set up our displayed error message
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    // because of mongoose this is a mongoose object
    // if you call save on an existing object it will save the object by id
    Product.findById(prodId)
    .then(product => {
        // check if user is authenticated
        if (product.userId.toString() !== req.user._id.toString()) {
            // you did something fishy redirect back home
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product
        .save()
        // nested then block otherwise it would go
        .then(result => {
            console.log('updated product')
            // moved so the new values update after update was successful
            res.redirect('/admin/products')
        })
    })
    .catch(err => console.log(err))
    
}

exports.getProducts = (req,res,next) => {
    // this gives you all the products
    // add a filter where products were created by the user
    Product.find({userId: req.user._id})
    // select can control which fields are returned
    // .select('title price -_id')
    // utility method to use after find
    // gives you all the data in one step without writing nested data
    // .populate('userId', 'name')
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
    // check if it's both the correct product and correct user id
    Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
        console.log('destroyed product');
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err));
}