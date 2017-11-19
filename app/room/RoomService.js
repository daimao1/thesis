"use strict";
const RoomDao = require('./RoomDao');
const Room = require('./Room');
const SocketNamespace = require('../socket/SocketNamespace');
const Constants = require('../Constants');
//const SocketEventService = require('../socket/SocketEventService');

let roomList = [];
loadDataFromDb();

exports.newRoom = newRoom;
exports.deleteOne = deleteOne;
exports.getByAdminId = getByAdminId;
exports.getById = getById;
exports.addPlayerToRoom = addPlayerToRoom;
exports.removeAllPlayers = removeAllPlayers;
exports.removePlayer = removePlayer;
exports.getPlayersDTOs = getPlayersDTOs;
exports.getPlayerFromRoom = getPlayerFromRoom;
exports.nextPlayerTurn = nextPlayerTurn;
exports.setPlayersOrderFromMiniGame = setPlayersOrderFromMiniGame;
exports.endRound = endRound;
exports.saveGameState = saveGameState;
exports.markGameAsStarted = markGameAsStarted;
exports.isGameStarted = isGameStarted;
exports.endTurn = endTurn;

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

function deleteOne(roomToDelete) {

    for (let [index, room] of roomList.entries()) {
        if (room.id === roomToDelete.id) {
            roomList.splice(index, 1);
            RoomDao.deleteById(roomToDelete.id).then(logDeleteSuccess).catch(reject => {
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
    getRoomByIdUnauthorized(player.room_id).removePlayer(player);
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
        throw new Error(`RoomService: really unexpected state. Go home.`);
    }
    return roomToReturn;
}

function getPlayerFromRoom(roomId, playerInRoomId) {
    if(roomId === undefined || playerInRoomId === undefined){
        throw new Error('RoomService#getPlayerFromRoom(): roomId or playerId undefined.');
    }
    const player = getRoomByIdUnauthorized(roomId).players[playerInRoomId];
    if(player === undefined){
        throw new Error('RoomService#getPlayerFromRoom(): cannot find player.');
    }
    return player;
}

function setPlayersOrderFromMiniGame(orderFromMiniGame, roomId) {

    const room = getRoomByIdUnauthorized(roomId);

    if (orderFromMiniGame === undefined || orderFromMiniGame.length > room.players.length) {
        throw new Error(`Room[${room.id}]#setNewPlayersOrder(): order incorrect.`);
    }
    if (room.currentPlayerId !== -1) {
        throw new Error(`Room[${room.id}]#setNewPlayersOrder(): current round is not finished.`);
    }
    setPlayersSpecialOrder(orderFromMiniGame, room);
    if (Constants.PLAYER_ORDER === Constants.PLAYER_ORDERS_OPTIONS.FIRST_TO_LAST) {
        room.setNewPlayersOrder(orderFromMiniGame); // Array is loaded from the end, so first player from mini game will be last.
    } else {
        // FIRST_TO_FIRST, first player from mini game will be first in board game
        room.setNewPlayersOrder(orderFromMiniGame.reverse());
    }
}

//Set 'special' order for first 2 players from mini game - this players get extra dices
function setPlayersSpecialOrder(playersOrder, room) {
    if(room.numberOfPlayers === 2){
        room.players[playersOrder[0]].extraDices = 1;
    } else {
        room.players[playersOrder[0]].extraDices = 2;
        room.players[playersOrder[1]].extraDices = 1;
    }
}

function nextPlayerTurn(roomId) {
    const room = getRoomByIdUnauthorized(roomId);
    let playerId;
    if(room.turnInProgress === true) {
        playerId = room.currentPlayerId;
    } else {
        room.turnInProgress = true;
        playerId = room.nextPlayerTurn();
    }
    if(playerId === -1){
        return undefined;
    }
    return room.players[playerId];
}

function endTurn(roomId) {
    getRoomByIdUnauthorized(roomId).turnInProgress = false;
}

function endRound(roomId) {
    endTurn(roomId);
    const room = getRoomByIdUnauthorized(roomId);
    room.currentPlayerId = -1;
    room.playersOrder = [];
    console.log('RoomService#endRound().');
}

function saveGameState(playerId, field, roomId) {
    if(field === undefined) {
        throw new Error('RoomService#saveGameState(): field undefined.');
    }

    field = +field;

    const playerToSave = getPlayerFromRoom(roomId, playerId);
    playerToSave.field_number = field;

    //RoomDao.updateRoom();
    //PlayerDao.updatePlayer();
    console.log(`RoomService#saveGameState(): saved player[${playerToSave.in_room_id}], room[${roomId}], field[${playerToSave.field_number}]`);
}

// function loadGameState(roomId){
//     //const room = RoomDao.getRoomById(roomId); // podmienić obiekt w tablicy na nowy - to będzie trunde
//     //const player = room.players[playerId].id //
//
//     const gameState = getPlayersDTOs(roomId);
//
//     return gameState;
// }

function getPlayersDTOs(roomId) {
    if(roomId === undefined){
        throw new Error('RoomService#getPlayersInfoDTO(): roomId undefined.');
    }

    const room = getRoomByIdUnauthorized(roomId);

    let playersDTOs = [];
    room.players.forEach( (player, index) => {
        playersDTOs[index] = { id: player.in_room_id, name: player.name, field: player.field_number };
    });
    if(playersDTOs.length === 0){
        throw new Error('RoomService#getPlayersInfoDTO(): there are no players in the room.');
    }
    if(playersDTOs.length !== room.players.length){
        throw new Error('RoomService#getPlayersInfoDTO(): creating DTO failed.');
    } else {
        return playersDTOs;
    }
}

function isGameStarted(roomId) {
    return getRoomByIdUnauthorized(roomId).isGameStarted;
}

function markGameAsStarted(roomId){
    const room = getRoomByIdUnauthorized(roomId);
    room.isGameStarted = true;
    room.numberOfPlayers = room.players.length;
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