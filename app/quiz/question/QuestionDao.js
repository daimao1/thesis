'use strict';
const db = require('../../config/dbconnection');
const dbConnection = db.getConnection();
const table_name = db.questions_table;

exports.saveQuestion = function (content, correct_answer, answer2, answer3, answer4){

    return new Promise((resolve, reject) => {
        dbConnection.query(
            'INSERT INTO ' + table_name + ' SET ?',
            {content: content, correct_answer: correct_answer, answer2: answer2, answer3: answer3, answer4: answer4},
            function (error, results) {
                if (error) {
                    console.error("Database "  + error);
                    reject(error); //send error to promise, have to be catch
                    //throw error;
                }
                else {
                    console.log('Database: insert to questions table with id: ' + results.insertId);
                    resolve(results.insertId);
                }
            }
        );
    });
};

exports.getAll = function (){

    return new Promise((resolve, reject) => {
        dbConnection.query('SELECT * FROM ' + table_name, function (error, results) {
            if (error) {
                console.error("Database "  + error);
                reject(error); //send error to promise, have to be catch
            }
            else {
                console.log('Database: selected all rows from ' + table_name + ' table.');
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
                reject(error); //send error to promise, have to be catch
            }
            else {
                console.log(`Database: deleting from ${table_name}...`);
                resolve(results);
            }
        });
    });
};
