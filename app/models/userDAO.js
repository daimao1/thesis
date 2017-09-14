/**
 * PLIK NIE JEST WYKORZYSTYWANY
 */

const database = require('../../config/dbconnection');
var dbcon = database.connection;


module.exports.add = function(user) {
    dbcon.query("INSERT INTO `users`(`email`, `password`) VALUES ('" + user.email + "', '" + user.password + "')", function (err) {
        if(!err) {
            console.log("User " + user.email + " has been successfully saved in database.");
        } else {
            console.log("Error while saving user in database: " + err.message);
        }
    });
};


