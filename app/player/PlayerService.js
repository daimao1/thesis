//const RoomDao = require('./RoomDao');
//const SocketNamespace = require('../socket/SocketNamespace');
//const RoomService = require('../room/RoomService');
const Player = require('../player/Player');
//const RoomService = require('../room/RoomService');

//let playerList = []; // bez sensu...

// function loadDataFromDb() {
//     let promise = RoomDao.getAll();
//     promise.then((rows) => {
//         roomList = rows;
//         console.log(`Data loaded from database successfully (Rooms table, set [${rows.length}] rows).`);
//     });
// }
//loadDataFromDb();

function newPlayer(roomId, socket) {
    'use strict';
    //TODO insert player to DB and get ID
    const player = new Player(1, 'imie', 1, roomId, socket);
    console.log(`PlayerService: new player. Socket.id: ${socket.id}`);
    return player;
}

exports.newPlayer = newPlayer;

// exports.deleteById = function (id) {
//     "use strict";
//
//     /*
//     * Operator '+id' means: If 'id' is a string, parse to number
//     * It is important, because 'id' from request params is a string
//     * And in this case comparision below does not work
//     */
//     id = +id;
//
//     for (let [index, room] of roomList.entries()) {
//
//         if (room.id === id) {
//             roomList.splice(index, 1);
//             RoomDao.deleteById(id).then(logDeleteSuccess);
//             break;
//         }
//     }
// };

// exports.findAll = function () {
//     "use strict";
//     console.log("RoomList: " + roomList);
//     return roomList;
// };

// exports.getByAdminId = function (id) {
//     "use strict";
//     let adminRooms = [];
//     roomList.forEach(room => {
//         if (room.administrator_id === id) {
//             adminRooms.push(room);
//         }
//     });
//     return adminRooms;
// };
//
// exports.getById = function (roomId, adminId) {
//     "use strict";
//
//     /*
//     * Operator '+id' means: If 'id' is a string, parse to number
//     * It is important, because 'id' from request params is a string
//     * And in this case comparision below does not work
//     */
//     roomId = +roomId;
//     adminId = +adminId;
//
//     let roomToReturn;
//     roomList.some(roomFromList => {
//         if (roomFromList.id === roomId) {
//             roomToReturn = roomFromList;
//             return true; // In function 'some', 'return true' is operation like 'break';
//         }
//     });
//
//     if (roomToReturn !== undefined && roomToReturn.administrator_id === adminId) {
//         new SocketNamespace(roomToReturn.id);
//         return roomToReturn;
//     }
//     else {
//         return undefined;
//     }
// };