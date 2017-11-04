"use strict";
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
exports.removePlayer = removePlayer;

function logDeleteSuccess(results) {
    console.log(`Deleted [${results.affectedRows}] rows from rooms table.`);
}

function loadDataFromDb() {
    RoomDao.getAll().then((rows) => {
        rows.forEach((row) => {
            roomList.push(new Room(row.id, row.name, row.administrator_id));
        });
        console.log(`Data loaded from database successfully (Rooms table, set [${rows.length}] rows).`);
    }).catch(reject => {
        throw reject;
    });
}

function newRoom(roomName, adminId) {
    if (roomName === undefined || adminId === undefined) {
        throw new Error('RoomService: room name or adminId undefined.');
    }
    RoomDao.saveRoom(roomName, adminId).then((insertedId) => {
        const socketNamespace = new SocketNamespace(insertedId);
        const room = new Room(insertedId, roomName, adminId, socketNamespace);
        roomList.push(room);
    }).catch(reject => {
        throw reject;
    });
}

function deleteById(id) {
    /*
    * Operator '+id' means: If 'id' is a string, parse to number
    * It is important, because 'id' from request params is a string
    * And in this case comparision below does not work
    */
    id = +id;

    for (let [index, room] of roomList.entries()) {
        if (room.id === id) {
            roomList.splice(index, 1);
            RoomDao.deleteById(id).then(logDeleteSuccess).catch(reject => {
                throw reject;
            });
            break;
        }
    }
}

function getByAdminId(id) {
    let adminRooms = [];
    roomList.forEach(room => {
        if (room.administrator_id === id) {
            adminRooms.push(room);
        }
    });
    return adminRooms;
}

function getById(roomId, adminId) {
    /*
    * Operator '+id' means: If 'id' is a string, parse to number
    * It is important, because 'id' from request params is a string
    * And in this case comparision below does not work
    */
    roomId = +roomId;
    adminId = +adminId;

    let roomToReturn;
    for (let room of roomList) {
        if (room.id === roomId) {
            roomToReturn = room;
            break;
        }
    }
    if (roomToReturn === undefined) {
        throw new Error(`RoomService: cannot find room with id[${roomId}].`);
    }
    if (roomToReturn.administrator_id !== adminId) {
        throw new Error(`RoomService: admin[${adminId}] is not the owner of room[${roomId}]`);
    }
    else if (roomToReturn.socketNamespace === undefined) {
        //TODO przenieść to gdzieś, getter to nie jest dobre miejsce
        roomToReturn.addSocketNamespace(new SocketNamespace(roomToReturn.id));
    }
    return roomToReturn;
}

function addPlayerToRoom(player) {

    const room = getById(player.roomId, 1); //TODO adminID

    if (room === undefined) {
        throw new Error('Room undefined');
    }
    else {
        room.addPlayer(player);
    }
}

function removeAllPlayers(socketNamespace) {
    getRoomBySocketNamespace(socketNamespace).removeAllPlayers();
}

function removePlayer(socketNamespace, player) {
    if (player === undefined || socketNamespace === undefined) {
        throw new Error("RoomService: player undefined");
    }
    getRoomBySocketNamespace(socketNamespace).removePlayer(player);
}

function getRoomBySocketNamespace(socketNamespace) {
    let roomToReturn;
    for (let room of roomList) {
        if (room.socketNamespace === socketNamespace) {
            roomToReturn = room;
            break;
        }
    }
    if (roomToReturn === undefined) {
        throw new Error(`RoomService: cannot find room with socketNamespace.roomId[${socketNamespace.roomId}].`);
    }
    if(roomToReturn.id !== socketNamespace.roomId) {
        throw new Error(`FATAL ERROR RoomService: unexpected state.`);
    }
    return roomToReturn;
}

// exports.findAll = function () {
//     console.log("RoomList: " + roomList);
//     return roomList;
// };