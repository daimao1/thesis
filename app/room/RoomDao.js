const db = require('../../config/dbconnection');
const dbconnection = db.connection;

module.exports = saveRoom;

function saveRoom(roomName, administratorId, callback){

    dbconnection.query('INSERT INTO ' + db.rooms_table + ' SET ?', {room_name: roomName, administrator_id: administratorId}, function (error, results) {
        if (error) {
            throw error;
            // console.error('Database error!', error);
        }
        console.log('Inserted new row to rooms table with id: ' + results.insertId);

        callback(results.insertId);
        //return results.insertId;
    });
}
