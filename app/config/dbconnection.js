"use strict";
const mysql = require('mysql');
let connection;
const productionUrl = {
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'ba7796f0de13d2',
    password: '6e704ee6',
    database: 'heroku_f993dad1a7fd975'
};
const localTestUrl = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pollub73_test'
};
const localDevUrl = {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'pollub73'
};
let url;

function setUrl() {
    console.log('node env: ' + process.env.NODE_ENV);
    switch (process.env.NODE_ENV) {
        case 'development':
            url = localDevUrl;
            console.log('Database url set to development.');
            break;
        case 'test':
            url = localTestUrl;
            console.log('Database url set to test.');
            break;
        case 'production':
            url = productionUrl;
            console.log('Database url set to production.');
            break;
        default:
            url = localDevUrl;
    }
    return url;
}

function connectToDatabase() {
    const newConnection = mysql.createConnection(url);
    newConnection.connect(function (err) {
        if (!err) {
            console.log("Database is connected as id: " + connection.threadId);
        } else {
            throw err;
            //throw new Error(`Cannot connect to database! Connection url: [${Object.keys(url)}][${Object.values(url)}]`);
        }
    });
    return newConnection;
}


function getConnection() {
    if (connection === undefined) {
        setUrl();
        connection = connectToDatabase();
    }
    return connection;
}

function endConnection() {
    if (connection !== undefined) {
        connection.end();
    }
}

module.exports = {
    getConnection, endConnection,
    admins_table: 'administrators',
    players_table: 'players',
    rooms_table: 'rooms',
    quiz_table: 'quiz'
};