const mysql = require('mysql2');

// create the connection pool which allow to always reach out to sql when we have a query to run
const pool = mysql.createPool({
    // define server information
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'root'
});

module.exports = pool.promise();