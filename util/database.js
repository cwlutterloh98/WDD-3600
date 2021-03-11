const mongodb = require('mongodb');
// constructed the database connection a little differently than the chapter did
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://admin:8gnySvM515BP5ekz@cluster0.vmhsq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// underscore signals we will only use this in this file
let _db;

// create a method to connect
const mongoConnect = (callback) => {
    // hard coded password!
    MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log("connected")
        // connects to the single database and will create one the first time it is accessed
        _db = client.db();
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

// returns access to that connected database if it exists
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "No database found";
}
// export the connection
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;