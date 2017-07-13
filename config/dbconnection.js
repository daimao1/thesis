/**
 * Created by Tobiasz on 2017-07-12.
 */
var mysql = require('mysql');

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
    } else {
        console.log("Error connecting database...");
    }
});

module.exports = { connection, url,
    database: 'pollub73',
    admins_table: 'administrators',
    players_table: 'players',
    rooms_table: 'rooms',
    quiz_table: 'quiz'};