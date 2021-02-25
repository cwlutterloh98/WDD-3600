// requires pool object for sql database
const db = require('../util/database');

const cart = require('./cart');

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
    // retrive all products from the array
    // returns all fields from products table
    static fetchAll() {
        return db.execute('SELECT * FROM products');
    }

    // checks products until true and returns the promise with the product id
    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?', [id])
    }
}