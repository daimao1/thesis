/**
 * Created by Tobiasz on 2017-07-12.
 */

var mysql = require('mysql');
var db = require('../config/dbconnection');
var connection = mysql.createConnection({
    host: db.url.host,
    user: db.url.user,
    password: db.url.password
});
connection.query('DROP DATABASE IF EXISTS ' + db.database);
connection.query('CREATE DATABASE ' + db.database);

//create administrators table
connection.query('\
    CREATE TABLE `' + db.database + '`.`' + db.admins_table + '` ( \
    `id` INT NOT NULL AUTO_INCREMENT, \
    `email` VARCHAR(30) NOT NULL, \
    `password` CHAR(30) NOT NULL, \
        PRIMARY KEY (`id`), \
    UNIQUE INDEX `email_UNIQUE` (`email` ASC) \
    )',
    function (err) {
        if (err) {
            console.log(err.message);
        }
        else
            console.log('Success: table ' + db.admins_table + ' created!');
    });

//create rooms table
connection.query('\
    CREATE TABLE `' + db.database + '`.`' + db.rooms_table + '` (\
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,\
`room_name` VARCHAR(20),\
`administrator_id` INT NOT NULL,\
PRIMARY KEY (`id`,`administrator_id`),\
INDEX `FK_ROOMS_ADMINISTRATORS_IDX` (`administrator_id` ASC),\
CONSTRAINT `FK_ROOMS_ADMINISTRATORS` \
FOREIGN KEY (`administrator_id`)\
REFERENCES `pollub73`.`administrators` (`id`)\
ON DELETE NO ACTION \
ON UPDATE NO ACTION)',
    function (err) {
        if (err) {
            console.log(err.message);
        }
        else
            console.log('Success: table ' + db.rooms_table + ' created!');
    });

//create players table
connection.query('\
    CREATE TABLE `' + db.database + '`.`' + db.players_table + '` (\
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,\
`player_name` VARCHAR(20) NOT NULL,\
`device_id` VARCHAR(40) NOT NULL,\
`field_number` INT,\
`room_id` INT UNSIGNED,\
PRIMARY KEY (`id`,`room_id`),\
INDEX `FK_PLAYERS_ROOMS_IDX` (`room_id` ASC),\
CONSTRAINT `FK_PLAYERS_ROOMS` FOREIGN KEY (`room_id`) REFERENCES `pollub73`.`rooms` (`id`)\
ON DELETE NO ACTION\
 ON UPDATE NO ACTION)',
    function (err) {
        if (err) {
            console.log(err.message);
        }
        else
            console.log('Success: table ' + db.players_table + ' created!');
    });

//create quiz table
connection.query('\
    CREATE TABLE `' + db.database + '`.`' + db.quiz_table + '` (\
`id` INT UNSIGNED NOT NULL AUTO_INCREMENT,\
`content` VARCHAR(300) NOT NULL,\
`correct_answer` VARCHAR(20) NOT NULL,\
`variant1` VARCHAR(20) NOT NULL,\
`variant2` VARCHAR(20) NOT NULL,\
`variant3` VARCHAR(20) NOT NULL,\
PRIMARY KEY (`id`),\
UNIQUE INDEX `id_UNIQUE` (`id` ASC))',
    function (err) {
        if (err) {
            console.log(err.message);
        }
        else
            console.log('Success: table ' + db.quiz_table + ' created!');
    });

connection.end();


