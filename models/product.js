// requires file system and path
const fs = require('fs');
const path = require('path');

const cart = require('./cart');

// create global constant 
const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);

// create helper function
const getProductsFromFile = cb => {
    const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'products.json'
    );
    // watch out for asynchronous error
    fs.readFile(p,(err,fileContent) => {
        if (err) {
            return cb([]);
        } else {
            cb(JSON.parse(fileContent));
        }
    });
}

// a class is a template for creating objects.
module.exports = class Product {
    constructor(id,title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }
    // create the save method
    // 'this' refers to the object created by the class
    // if we have an id save should not create a new id but instead should update
    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
                    console.log(err)
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                // take Javascript array and turn it into correct JSON format
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err)
                });
            } 
        });
    }

    // create the delete method
    // filter checks for the single item you are looking for it is deleted
    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id)
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                // if there is no error make sure to remove item from cart
                if (!err) {
                    Cart.deleteProduct(id, product.price);
                }
            });
        })
    }
    // retrive all products from the array
    // cb is for call back to let you know function is done.
    // static means you control this method directly on the class itself
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    // checks products until true and returns the callback with the product id
    // shortened curly braces can be used if it's one line
    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        })
    }
}