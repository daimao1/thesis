"use strict";
const mysql = require('mysql');
let connection;
const productionUrl = {
    host: 'kavfu5f7pido12mr.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'o8rlhocwjocffey7',
    password: 'rjsjihhk7f058rzg',
    database: 'iv2gmnvg8cx5ssrf'
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
            console.log('WARNING: Database url set to production!');
            console.log('WARNING: Every db operation will be executed in production database!');
            break;
        default:
            console.log('NODE_ENV undefined. Database url set to development.');
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
        console.log('Creating new db connection...');
        connection = connectToDatabase();
    }
    return connection;
}

function endConnection() {
    if (connection !== undefined) {
        console.log('End db connection.');
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