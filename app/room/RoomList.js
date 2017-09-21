//const Room = require('./Room.js');

const RoomDao = require('./RoomDao.js');

let roomList = [];

exports.add = function (room) {
    roomList.push(room);
};

// //TODO test!!!
// exports.deleteByGameNumber = function (number){
//     "use strict";
//     for (let [index, room] of roomList.entries()) {
//         if(room.gameNumber === number){ //moze nie działac, patrz deleteById
//             roomList.splice(index, 1); //TODO test!!!
//         }
//     }
// };

function deleteSuccess(results) {
    console.log(`Deleted [${results.affectedRows}] rows from rooms table`);
}

exports.deleteById = function (id){
    "use strict";
    for (let [index, room] of roomList.entries()) {
        if(room.id == id){ // koniecznie ==, bez porównania typów, room.id jest typu string
            roomList.splice(index, 1); //TODO test!!!
            RoomDao.deleteById(id).then(deleteSuccess);
            break;
        }
    }
};

// //TODO test!!!
// exports.deleteOne = function (room) {
//     const index = roomList.indexOf(room);
//     roomList.splice(index, 1);
// };

exports.getAll = function () {
    "use strict";
    console.log("RoomList: " + roomList);
    return roomList;
};

exports.loadDataFromDb = function () {
    "use strict";
    let promise = RoomDao.getAll();
    promise.then((rows) => {
        roomList = rows;
        console.log(`Data loaded from database successfully (Rooms table, set [${rows.length}] rows).`);
    });
};

exports.getByAdminId = function (id) {
    "use strict";
    let adminRooms = [];
    roomList.forEach(room => {
        if(room.administrator_id === id){
            adminRooms.push(room);
        }
    });
    return adminRooms;
};