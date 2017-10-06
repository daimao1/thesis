const RoomDao = require('./RoomDao');
const Room = require('./Room');
const SocketNamespace = require('../socket/SocketNamespace');

let roomList = [];
loadDataFromDb();

exports.newRoom = newRoom;
exports.deleteById = deleteById;
exports.getByAdminId = getByAdminId;
exports.getById = getById;
exports.addPlayerToRoom = addPlayerToRoom;
exports.removeAllPlayers = removeAllPlayers;

function logDeleteSuccess(results) {
    console.log(`Deleted [${results.affectedRows}] rows from rooms table.`);
}

function loadDataFromDb() {
    let promise = RoomDao.getAll();
    promise.then((rows) => {
        rows.forEach((row) => {
            "use strict";
            roomList.push(new Room(row.id, row.name, row.administrator_id));
        });
        console.log(`Data loaded from database successfully (Rooms table, set [${rows.length}] rows).`);
    });
}

function newRoom(roomName, adminId) {
    'use strict';
    if(roomName === undefined || adminId === undefined) {
        throw new Error('Room name or adminId undefined.');
    }
    RoomDao.saveRoom(roomName, adminId).then((insertedId) => {
        const socketNamespace = new SocketNamespace(insertedId);
        const room = new Room(insertedId, roomName, adminId, socketNamespace);
        roomList.push(room);
    }).catch(error => {
        throw error;
    });
}

function deleteById(id){
    "use strict";

    /*
    * Operator '+id' means: If 'id' is a string, parse to number
    * It is important, because 'id' from request params is a string
    * And in this case comparision below does not work
    */
    id = +id;

    for (let [index, room] of roomList.entries()) {
        if(room.id === id){
            roomList.splice(index, 1);
            RoomDao.deleteById(id).then(logDeleteSuccess);
            break;
        }
    }
}

function getByAdminId(id) {
    "use strict";
    let adminRooms = [];
    roomList.forEach(room => {
        if(room.administrator_id === id){
            adminRooms.push(room);
        }
    });
    return adminRooms;
}

function getById(roomId, adminId) {
    "use strict";
    /*
    * Operator '+id' means: If 'id' is a string, parse to number
    * It is important, because 'id' from request params is a string
    * And in this case comparision below does not work
    */
    roomId = +roomId;
    adminId = +adminId;

    let roomToReturn; //TODO to nie jest obiekt klasy ROOM -> a teraz?
    for (let room of roomList) {
        if(room.id === roomId){
            roomToReturn = room;
            break;
        }
    }
    if(roomToReturn === undefined || roomToReturn.administrator_id !== adminId) {
        return undefined;
    }
    else if(roomToReturn.socketNamespace === undefined) {
        roomToReturn.addSocketNamespace(new SocketNamespace(roomToReturn.id));
    }
    return roomToReturn;
}

function addPlayerToRoom(player) {
    "use strict";

    const room = getById(player.roomId, 1); //TODO adminID

    if (room === undefined){
        throw new Error('Room undefined');
    }
    else {
        room.addPlayer(player);
    }
}

function removeAllPlayers(roomId) {
    "use strict";
    getById(roomId).removePlayers();
}

// exports.findAll = function () {
//     "use strict";
//     console.log("RoomList: " + roomList);
//     return roomList;
// };


// exports.addPlayer = function (roomId, player) {
//
//     const room = this.getById(roomId, 1); //TODO adminID
//     room.addNewPlayer(player);
// };