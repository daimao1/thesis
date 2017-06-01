var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pollub73'
});
var app = express();

connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});

app.get("/administrators", function (req, res) {
    connection.query('SELECT * from administrators', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else {
            console.log('Error while performing Query (administrators).');
        }
    });

});

app.get("/players", function (req, res) {
    connection.query('SELECT * from players', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query (players).');
    });
});

app.get("/quiz", function (req, res) {
    connection.query('SELECT * from quiz', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query (quiz).');
    });
});

app.get("/rooms", function (req, res) {
    connection.query('SELECT * from rooms', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query (rooms).');
    });
});

app.listen(3000);

