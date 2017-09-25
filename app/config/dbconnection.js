/**
 * Created by Tobiasz on 2017-07-12.
 */
const mysql = require('mysql');

const url = {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'pollub73'
};

const connection = mysql.createConnection(url);
connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected as id: " + connection.threadId);
    } else {
        throw new Error(`Cannot connect to database! Connection url: [${Object.keys(url)}][${Object.values(url)}]`);
    }
});

module.exports = { connection, url,
    database: 'pollub73',
    admins_table: 'administrators',
    players_table: 'players',
    rooms_table: 'rooms',
    quiz_table: 'quiz'
};