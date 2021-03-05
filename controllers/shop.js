const Product = require('../models/product');

// Middleware add getProducts for shop.js
exports.getProducts = (req, res, next) => {
    // this gives you all the products
    Product.findAll().then(products => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products'
        })
     }).catch(err => {
         console.log(err);
     });
};

// params object we can access our productId because we used our productId in our routes
// render product detail
exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    // Product.findAll({where: {id: prodId}})
    // .then(products => {
    //     res.render('shop/product-detail', {
    //         product: products[0],
    //         pageTitle: products[0].title,
    //         path: '/products'
    //         });
    // })
    // .catch(err => console.log(err))

    // replace findbyID with findbyPk
    Product.findByPk(prodId)
    .then(product => {
        res.render('shop/product-detail', {
            product: product,
            pageTitle: product.title,
            path: '/products'
        });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req,res,next) => {
     // this gives you all the products
     Product.findAll().then(products => {
        // use the default templating engine and return that template and pass in data that should be added into our view
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        })
     }).catch(err => {
         console.log(err);
     });
};

exports.getCart = (req, res, next) => {
    req.user
      .getCart()
      .then(cart => {
        return cart
          .getProducts()
          .then(products => {
            res.render('shop/cart', {
              path: '/cart',
              pageTitle: 'Your Cart',
              products: products
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };

// accepts a post request
exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({where: {id: prodId}})
    })
    // checks if there is already that product in the cart
    .then(products => {
        let product;
        if (products.length > 0) {
            product = products[0];
        }
        // if there is already a product increase it by 1
        if (product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }
        return Product.findByPk(prodId)
    })

    // data holds the product needs to be added and quantity
    .then(product => {
        return fetchedCart.addProduct(product,{
            through: { quantity: newQuantity}
        });
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err))
}

// remove item only from the cart not the products
exports.postCartDeleteProduct = (req,res,next) => {
    const prodId = req.body.productId;
    req.user.getCart()
    // get the products from the cart
    .then(cart => {
        return cart.getProducts({where: {id: prodId}});
    })
    // destroy the product from the in between cartitems table
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result=> {
        res.redirect('/cart');
    })
    .catch(err=> console.log(err))

};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts();
    })
    // createOrder attaches a user to an order
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            // assign a special field
            // map returns a new array with modified elements
            return order.addProducts(products.map(product => {
                // in orderItem in order-item model
                // configure value in table to equal quantity in cart
                product.orderItem = { quantity: product.cartItem.quantity};
                return product;
            }))
        })
        .catch(err=> console.log(err));
    })
    .then(result => {
        return fetchedCart.setProducts(null);
    })
    .then(result => {
        res.redirect('/orders')
    })
    .catch(err => console.log(err));
};
exports.getOrders = (req,res,next) => {
    req.user
    // eager loading tells sequelize to also include the products for order
    // only works because we have a relationship between products and orders in app.js
    .getOrders({include: ['products']})
    .then(orders => {
        res.render('shop/orders', {
            path: '/orders',        
            pageTitle: 'Your orders',
            orders: orders
        })
    })
    .catch(err => console.log(err))
};
