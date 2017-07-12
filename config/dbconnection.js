/**
 * Created by Tobiasz on 2017-07-12.
 */
var mysql = require('mysql');

const config = {
    database: 'pollub73',
    users_table: 'users'
};
const url = {
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'pollub73'
};

var connection = mysql.createConnection(url);
connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected as id: " + connection.threadId);
        console.log(connection.statistics());
    } else {
        console.log("Error connecting database...");
    }
});

module.exports = { connection, url, database: 'pollub73', users_table: 'users' };
