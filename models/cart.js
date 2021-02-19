const fs = require('fs');
const path = require('path');

// create global constant for path
const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // fetch the old or previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }

            // analyze the cart => find existing product
            const existingProductIndex = cart.products.findIndex(
                prod => prod.id === id
            );
            const existingProduct = cart.products[existingProductIndex];

            let updatedProduct;

            // Add new product / increase the quantity
            if (existingProduct) {
                updatedProduct = {...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };

                // create an array with all the old cart products and adding new
                cart.products = [...cart.products, updatedProduct];
            }
            // the plus in front of product price converts it into a number
            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });

    };

    // create static method to delete product form cart and update the total cart price
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            // if you don't find a cart then you can ignore this
            if (err) {
                return;
            }
            const updatedCart = {...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            // fixes a bug if product doesn't exist in cart
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(
                prod => prod.id !== id
            );
            // adjust the total price so the price of a product times the quantity of that product are subtracted from the total
            updatedCart.totalPrice =
             updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });
        });
    };

    static getCart(cb) {
        fs.readFile(p, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
};