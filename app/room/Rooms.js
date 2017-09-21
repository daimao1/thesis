const RoomDao = require('./RoomDao');
const Room = require('./Room');

let roomList = [];
loadDataFromDb();

function logDeleteSuccess(results) {
    console.log(`Deleted [${results.affectedRows}] rows from rooms table`);
}

function loadDataFromDb() {
    let promise = RoomDao.getAll();
    promise.then((rows) => {
        roomList = rows;
        console.log(`Data loaded from database successfully (Rooms table, set [${rows.length}] rows).`);
    });
}

exports.new = function (name, adminId) {
    if(name !== undefined) {
        roomList.push(new Room(name, adminId));
    }
};

exports.deleteById = function (id){
    "use strict";
    for (let [index, room] of roomList.entries()) {

        /*
        *  type of 'id' is string
        *  type of '+id' is number
        *  Conversion to number is necessary in comparision below
        */
        if(room.id === +id){
            roomList.splice(index, 1);
            RoomDao.deleteById(id).then(logDeleteSuccess);
            break;
        }
    }
};

// exports.findAll = function () {
//     "use strict";
//     console.log("RoomList: " + roomList);
//     return roomList;
// };

exports.findByAdminId = function (id) {
    "use strict";
    let adminRooms = [];
    roomList.forEach(room => {
        if(room.administrator_id === id){
            adminRooms.push(room);
        }
    });
    return adminRooms;
};

