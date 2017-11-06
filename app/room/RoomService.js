"use strict";
const RoomDao = require('./RoomDao');
const Room = require('./Room');
const SocketNamespace = require('../socket/SocketNamespace');
//const SocketEventService = require('../socket/SocketEventService');

let roomList = [];
loadDataFromDb();

exports.newRoom = newRoom;
exports.deleteById = deleteById;
exports.getByAdminId = getByAdminId;
exports.getById = getById;
exports.addPlayerToRoom = addPlayerToRoom;
exports.removeAllPlayers = removeAllPlayers;
exports.removePlayer = removePlayer;
exports.getPlayersInfoDTO = getPlayersInfoDTO;
exports.getPlayerFromRoom = getPlayerFromRoom;

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

    const room = getRoomByIdUnauthorized(player.room_id);

    if (room === undefined) {
        throw new Error('RoomService#addPlayerToRoom(): Room undefined');
    }
    else {
        room.addPlayer(player);
    }
}

function removeAllPlayers(socketNamespace) {
    getRoomBySocketNamespace(socketNamespace).removeAllPlayers();
}

function removePlayer(player) {
    if (player === undefined) {
        throw new Error("RoomService#removePlayer(): player undefined");
    }
    getRoomByIdUnauthorized(player.roomId).removePlayer(player);
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

function getPlayersInfoDTO(roomId) {
    if(roomId === undefined){
        throw new Error('RoomService#getPlayersInfoDTO(): roomId undefined');
    }

    const room = getRoomByIdUnauthorized(roomId);

    //TODO test it!
    let playersInfo = [];
    room.players.forEach( (player, index) => {
        playersInfo[index] = { name: player.name, inRoomId: player.in_room_id };
    });
    if(playersInfo.length === 0){
        throw new Error('RoomService#getPlayersInfoDTO(): there are no players in the room');
    } else {
        return playersInfo;
    }
}

function getPlayerFromRoom(roomId, playerInRoomId) {
    if(roomId === undefined || playerInRoomId === undefined){
        throw new Error('RoomService#getPlayerFromRoom(): roomId or playerId undefined.');
    }
    const player = getRoomByIdUnauthorized(roomId).players[playerInRoomId];
    if(player === undefined){
        throw new Error('RoomService#getPlayerFromRoom(): cannot find player.');
    }
}

/*
* Private function
*/
function getRoomByIdUnauthorized(roomId){
    let roomToReturn;
    for (let room of roomList) {
        if (room.id === roomId) {
            roomToReturn = room;
            break;
        }
    }
    if (roomToReturn === undefined) {
        throw new Error(`RoomService#getByIdUnauthorized(): cannot find room with id[${roomId}].`);
    }
    return roomToReturn;
}