/**
 * Created by Tobiasz on 2017-07-12.
 */

var mysql = require('mysql');
var db = require('../config/dbconnection');
var connection = mysql.createConnection({
    host     : db.url.host,
    user     : db.url.user,
    password : db.url.password
});

connection.query('CREATE DATABASE ' + db.database);

connection.query('\
    CREATE TABLE `' + db.database +'`.`' + db.users_table + '` ( \
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT, \
    `username` VARCHAR(20) NOT NULL, \
    `password` CHAR(60) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `id_UNIQUE` (`id` ASC), \
    UNIQUE INDEX `username_UNIQUE` (`username` ASC) \
)');

console.log('Success: database created!')

connection.end();
