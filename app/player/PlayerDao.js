'use strict';
const db = require('../config/dbconnection');
const table_name = db.players_table;
let dbConnection = db.getConnection();

//exports.setAlternativeDbConnection = setAlternativeDbConnection;
exports.savePlayer = savePlayer;
exports.getAll = getAll;

// function setAlternativeDbConnection(connection) {
//     //connection.end();
//     dbConnection = connection;
// }

function savePlayer(name, roomId, inRoomId){

    return new Promise((resolve) => {
        dbConnection.query(
            'INSERT INTO ' + table_name + ' SET ?',
            {name: name, room_id: roomId, in_room_id: inRoomId},
            function (error, results) {
                if (error) {
                    console.error("Database "  + error);
                    //reject(error); //send error to promise, have to be catch
                    throw error;
                }
                else {
                    console.log('PlayerDao#savePlayer(): insert success, generated id: ' + results.insertId);
                    resolve(results.insertId);
                }
            }
        );
    });
}

function getAll(){

    return new Promise((resolve) => {
        dbConnection.query('SELECT * FROM ' + table_name, function (error, results) {
            if (error) {
                console.error("Database "  + error);
                //reject(error); //send error to promise, have to be catch
                throw error;
            }
            else {
                console.log('PlayerDao#getAll(): selected all rows from ' + table_name + ' table.');
                resolve(results);
            }
        });
    });
}

exports.updatePlayer = function (player) {
    return new Promise((resolve, reject) => {
        dbConnection.query(`UPDATE ${table_name} SET ? WHERE id = ${player.id}`,
            {field_number: player.field_number},
            function (error, results) {
                if (error) {
                    console.error("Database "  + error);
                    reject(error); //send error to promise, have to be catched
                }
                else {
                    console.log(`Database#[${table_name}]: updated player with id[${player.id}].`);
                    resolve(results);
                }
            });
    });
};

exports.deleteById = function (id){

    return new Promise((resolve, reject) => {
        dbConnection.query(`DELETE FROM ${table_name} WHERE id = ${id}`, function (error, results) {
            if (error) {
                console.error("Database "  + error);
                reject(error); //send error to promise, have to be catched
            }
            else {
                console.log(`PlayerDao#deleteById: deleting from ${table_name}...`);
                resolve(results);
            }
        });
    });
};