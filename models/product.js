const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    // javascript constructor to create product
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        // select id or create new 
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId;
    }

    save() {
        const db = getDb();
        let dbOp;
        // if the id already exists
        if (this._id) {
            // Update the product
            dbOp = db.collection('products')
            .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: this});
        } else {
            dbOp = db.collection('products').insertOne(this);
        }
        // tells mongodb to which collection you want to insert something
        return dbOp
        .then(result => {
            console.log(result);
        })
        .catch(err=> {
            console.log(err);
        });
    }
    
    //interact with mongo to fetch all products
    static fetchAll() {
        const db = getDb();
        return db
        .collection('products')
        // find returns a cursor (an object that allows you to go through a collection step by step)
        .find()
        // toArray should only be used for a smaller docuemnts
        .toArray()
        .then(products => {
            console.log(products);
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    // fetch a single product
    static findById(prodId) {
        const db = getDb();
        return db
        .collection('products')
        // mongodb constuctor uses objectId to convert string to BJSON data type to compare
        .find({_id: new mongodb.ObjectId(prodId)})
        .next()
        .then(product => {
            console.log(product);
            return product;
        })
        .catch(err=> {
            console.log(err);
        })
    }

    // handle delete 
    static deleteById(prodId) {
        const db = getDb();
        return db
        .collection('products')
        .deleteOne({_id: new mongodb.ObjectId(prodId)})
        .then(result=>{
            console.log("deleted");
        })
        .catch(err=>{
            console.log(err);
        })
    }
}

module.exports = Product;