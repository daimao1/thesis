const db = require('../../config/dbconnection');
const dbconnection = db.connection;
const table_name = db.rooms_table;

exports.saveRoom = function (roomName, administratorId){

    return new Promise((resolve) => {
        dbconnection.query(
            'INSERT INTO ' + table_name + ' SET ?',
            {name: roomName, administrator_id: administratorId},
            function (error, results) {
                if (error) {
                    console.error("Database "  + error);
                    //reject(error); //send error to promise, have to be catched
                    throw error;
                }
                else {
                    console.log('Database: insert to rooms table with id: ' + results.insertId);
                    resolve(results.insertId);
                }
            }
        );
    });
};

exports.getAll = function (){
    "use strict";

    return new Promise((resolve) => {
        dbconnection.query('SELECT * FROM ' + table_name, function (error, results) {
            if (error) {
                console.error("Database " + error);
                throw error;
            }
            else {
                console.log('Database: selected all from ' + table_name + ' table.');
                resolve(results);
            }
        });
    });
};
