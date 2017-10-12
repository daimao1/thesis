/**
 * Created by Tobiasz on 2017-07-12.
 */
const mysql = require('mysql');

const url = {
    host     : 'us-cdbr-iron-east-05.cleardb.net',
    user     : 'ba7796f0de13d2',
    password : '6e704ee6',
    database : 'heroku_f993dad1a7fd975',
    port:3306
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
    database: 'heroku_f993dad1a7fd975',
    admins_table: 'administrators',
    players_table: 'players',
    rooms_table: 'rooms',
    quiz_table: 'quiz'
};