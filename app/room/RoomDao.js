const db = require('../config/dbconnection');
const dbconnection = db.connection;
const table_name = db.rooms_table;

exports.saveRoom = function (roomName, administratorId){
    'use strict';

    return new Promise((resolve, reject) => {
        dbconnection.query(
            'INSERT INTO ' + table_name + ' SET ?',
            {name: roomName, administrator_id: administratorId},
            function (error, results) {
                if (error) {
                    console.error("Database "  + error);
                    reject(error); //send error to promise, have to be catched
                    //throw error;
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

    return new Promise((resolve, reject) => {
        dbconnection.query('SELECT * FROM ' + table_name, function (error, results) {
            if (error) {
                console.error("Database "  + error);
                reject(error); //send error to promise, have to be catched
            }
            else {
                console.log('Database: selected all rows from ' + table_name + ' table.');
                resolve(results);
            }
        });
    });
};

exports.deleteById = function (id){
    "use strict";

    return new Promise((resolve, reject) => {
        dbconnection.query(`DELETE FROM ${table_name} WHERE id = ${id}`, function (error, results) {
            if (error) {
                console.error("Database "  + error);
                reject(error); //send error to promise, have to be catched
            }
            else {
                console.log(`Database: deleting from ${table_name}...`);
                resolve(results);
            }
        });
    });
};
