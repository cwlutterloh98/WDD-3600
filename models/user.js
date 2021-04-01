const mongoose = require('mongoose')

const Schema = mongoose.Schema;

// pass a javascript object to describe what the user should look like
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        // this is how you create an array of documents
        items: [{
            productId: {
                // refer to the product for the id defined through the product model
                type: Schema.Types.ObjectId, 
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    }
});

// add your own methods to your schema
userSchema.methods.addToCart = function(product) {
     // check if a certain item already exists
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString() ;
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        // new quantity if item already exists
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    // add a new cart item if it did not already exist
    else {
        updatedCartItems.push({
            // Mongoose automatically wraps it in an object id
            productId: product._id,
            quantity: newQuantity
        })
    }
    // new array with all the items spread
    // create an object that holds the properties of the products
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    // utility method save itself where we update the cart
    return this.save();
}

userSchema.methods.removeFromCart = function(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();
}

userSchema.methods.clearCart = function() {
    this.cart = {items: []};
    return this.save();
};
// mongoose automatically takes the pluarl lower case version of this for the collection name
module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;
// class User {
//     constructor(username,email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart; // {items: []}
//         this._id = id;
//     }
//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this);
//     }

//     addToCart(product) {
//         // check if a certain item already exists
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString() ;
//         });
//         let newQuantity = 1;
//         const updatedCartItems = [...this.cart.items];

//         if (cartProductIndex >= 0) {
//             // new quantity if item already exists
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//         }
//         // add a new cart item if it did not already exist
//         else {
//             updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity})
//         }
//         // new array with all the items spread
//         // create an object that holds the properties of the products
//         const updatedCart = {
//             items: updatedCartItems
//         };
//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//                 {_id: new ObjectId(this._id)}, 
//                 { $set: {cart: updatedCart}}
//             );
//     }

//     // return the cart items with respective quantiities
//     getCart() {
//         const db = getDb();
//         // create new array
//         const productIds = this.cart.items.map(i => {
//             // change to prodId to match database structure
//             return i.productId;
//         });
//         // $in get's all the items in an array
//         return db
//         .collection('products')
//         .find({_id: {$in: productIds}})
//         .toArray()
//         .then(products => {
//             return products.map(p => {
//                 return {
//                     ...p, quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString();
//                 }).quantity
//                 };
//             });
//         });
//     }

//     // method to delete the specified product id from the cart
//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         });
//         // update database without removed item
//         const db = getDb();
//         return db
//             .collection('users')
//             .updateOne(
//                 {_id: new ObjectId(this._id)}, 
//                 { $set: {cart: {items: updatedCartItems}}}
//             );
//     }

//     // method to add an order
//     addOrder() {
//         const db = getDb();
//         return this.getCart().then(products => {
//             // orders doesn't need to change in the order collection because we want snapshot
//             const order = {
//                 items: products,
//                 // no need to embed here because processed orders don't matter if they change
//                 user: {
//                     _id: new ObjectId(this._id),
//                     name: this.name
//                 }
//             }
//             return db.collection('orders')
//             .insertOne(order)
//         })
//         .then(result => {
//             this.cart = {items: []};
//             // code to update the users database to clear the cart
//             return db
//             .collection('users')
//             .updateOne(
//                 {_id: new ObjectId(this._id)}, 
//                 { $set: {cart: {items: []}}}
//             );
//         });
//     }

//     getOrders() {
//         const db = getDb();
//         // this will look inside the user property and look for the ._id property
//         return db.collection("orders").find({"user._id": new ObjectId(this._id)})
//         .toArray();
//     }
//     // find user in collection
//     static findById(userId) {
//         const db = getDb();
//         return db
//         .collection('users')
//         .findOne({_id: new ObjectId(userId) })
//         .then(user => {
//             console.log(user);
//             return user;
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     }
// }
// module.exports = User;