const mysql = require("mysql");
// Create database connection

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "362688Sz",
    database: "employee_db"
});

connection.connect(function(err) {
    if (err) throw err;

});

module.exports = connection;