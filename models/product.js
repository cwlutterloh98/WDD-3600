// requires pool object for sql database
const db = require('../util/database');

const cart = require('./cart');
<<<<<<< HEAD
=======

// create global constant 
const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);
>>>>>>> 5f57f7b574cb2c81bf936c68613b486c5b593c87

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
<<<<<<< HEAD
    save() {
       return db.execute
       ('INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
       [this.title, this.price, this.imageUrl, this.description]
       );
    }

    // create the delete method
    // filter checks for the single item you are looking for it is deleted
    static deleteById(id) {

    }
=======
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
>>>>>>> 5f57f7b574cb2c81bf936c68613b486c5b593c87
    // retrive all products from the array
    // returns all fields from products table
    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    // checks products until true and returns the promise with the product id
    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
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