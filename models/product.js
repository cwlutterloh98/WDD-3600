// requires file system and path
const fs = require('fs');
const path = require('path');

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
    constructor(t) {
        this.title = t;
    }
    // create the save method
    // 'this' refers to the object created by the class
    save() {
        getProductsFromFile(products => {
            products.push(this);
            // take Javascript array and turn it into correct JSON format
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err)
            });
        });

        

        // reads entire file at path p show the file content if it's successful
        fs.readFile(p, (err, fileContent) => {
        });
    }

    // retrive all products from the array
    // cb is for call back to let you know function is done.
    // static means you control this method directly on the class itself
    static fetchAll(cb) {
        getProductsFromFile(cb);
    }
}