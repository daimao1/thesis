const db = require('../../config/dbconnection');
const dbconnection = db.connection;

module.exports = saveRoom;

function saveRoom(roomName, administratorId){

    return new Promise((resolve) => {
        dbconnection.query(
            'INSERT INTO ' + db.rooms_table + ' SET ?',
            {room_name: roomName, administrator_id: administratorId},
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
}
