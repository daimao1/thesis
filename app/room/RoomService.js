"use strict";
const RoomDao = require('./RoomDao');
const Room = require('./Room');
const SocketNamespace = require('../socket/SocketNamespace');
const Constants = require('../utils/Constants');

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
exports.setPlayersOrder = setPlayersOrder;
exports.setExtraDices = setExtraDices;
exports.endRound = endRound;
exports.saveGameState = saveGameState;
exports.markGameAsStarted = markGameAsStarted;
exports.isGameStarted = isGameStarted;
exports.endTurn = endTurn;
exports.getAllPlayersFromRoom = getAllPlayersFromRoom;
exports.getCurrentPlayerId = getCurrentPlayerId;
exports.getGameSocketFromRoom = getGameSocketFromRoom;
exports.getNumberOfPlayers = getNumberOfPlayers;
exports.isRoomExist = isRoomExist;

function logDeleteSuccess(results) {
    console.log(`Deleted [${results.affectedRows}] rows from rooms table.`);
}

function loadDataFromDb() {
    RoomDao.getAll().then((rows) => {
        rows.forEach((row) => {
            roomList.push(new Room(row.id, row.name, row.administrator_id));
        });
        console.log(`Data loaded from database successfully (Rooms table, get [${rows.length}] rows).`);
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
        roomToReturn.addSocketNamespace(new SocketNamespace(roomToReturn.id));
    }
    return roomToReturn;
}

function addPlayerToRoom(player) {

    const room = getRoomByIdUnauthorized(player.room_id);

    if (room === undefined) {
        throw new Error('RoomService#addPlayerToRoom(): Room undefined');
    }
    else if (room.isGameStarted === true) {
        throw new Error('RoomService#addPlayerToRoom(): cannot add new player, game is already started.');
    } else {
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
    if (roomToReturn.id !== socketNamespace.roomId) {
        throw new Error(`RoomService: really unexpected state. Go home.`);
    }
    return roomToReturn;
}

function getPlayerFromRoom(roomId, playerInRoomId) {
    if (roomId === undefined || playerInRoomId === undefined) {
        throw new Error('RoomService#getPlayerFromRoom(): roomId or playerId undefined.');
    }
    const player = getRoomByIdUnauthorized(roomId).players[playerInRoomId];
    if (player === undefined) {
        throw new Error(`RoomService#getPlayerFromRoom(): cannot find player with id[${playerInRoomId}] in room[${roomId}].`);
    }
    return player;
}

function setPlayersOrder(order, roomId) {

    const room = getRoomByIdUnauthorized(roomId);
    clearExtraDices(room);

    if (order === undefined || order.length > room.players.length) {
        throw new Error(`Room[${room.id}]#setNewPlayersOrder(): order incorrect.`);
    }
    if (room.currentPlayerId !== -1) {
        throw new Error(`Room[${room.id}]#setNewPlayersOrder(): current round is not finished.`);
    }

    if (Constants.PLAYER_ORDER === Constants.PLAYER_ORDERS_OPTIONS.FIRST_TO_LAST) {
        room.setNewPlayersOrder(order); // Array is loaded from the end, so first player from mini game will be last.
    } else {
        // FIRST_TO_FIRST, first player from mini game will be first in board game
        room.setNewPlayersOrder(order.reverse());
    }
}

/**
 * @param {number} roomId
 * @param {number[]} sortedResults
 * @param {number[]} playersOrder - array of in_room_id parameters sorted by results from the mini game (from the best)
 */
function setExtraDices(roomId, playersOrder, sortedResults) {
    //if something undefined
    const players = getRoomByIdUnauthorized(roomId).players;

    if (playersOrder.length === 2) {
        if (sortedResults[0] === sortedResults[1] && sortedResults[0] !== 0) {
            players[playersOrder[0]].extraDices = 1;
            players[playersOrder[1]].extraDices = 1;
        } else if (sortedResults[0] !== sortedResults[1]) {
            players[playersOrder[0]].extraDices = 1;
        }
    } else if (playersOrder.length > 2 && playersOrder.length <= Constants.MAX_PLAYERS) {
        const distinctResults = [...new Set(sortedResults)];
        if (distinctResults.length === 1 && distinctResults[0] !== 0) {
            for (let i = 0; i < players.length; i++) {
                players[i].extraDices = 1;
            }
        } else if (distinctResults.length === 2 && distinctResults[1] === 0) {
            for (let i = 0; i < players.length; i++) {
                if (sortedResults[i] === distinctResults[0]) {
                    players[playersOrder[i]].extraDices = 1;
                }
            }
        } else if (distinctResults.length > 2) {
            for (let i = 0; i < 2; i++) {
                for (let k = 0; k < sortedResults.length; k++) { //todo while
                    if(sortedResults[k] === distinctResults[i]) {
                        if (i === 0) {
                            players[playersOrder[k]].extraDices = 2;
                        } else if(i === 1){
                            players[playersOrder[k]].extraDices = 1;
                        }
                    } else {
                        break;
                    }
                }
            }
        }
    } else {
        throw new Error(`RoomService#setExtraDices: unexpected size of playersOrder: [playersOrder: ${playersOrder}]`);
    }
}

function clearExtraDices(players) {
    for (let i = 0; i < players.length; i++) {
        players[i] = undefined;
    }
}

function nextPlayerTurn(roomId) {
    const room = getRoomByIdUnauthorized(roomId);
    let playerId;
    if (room.turnInProgress === true) {
        playerId = room.currentPlayerId;
    } else {
        room.turnInProgress = true;
        playerId = room.nextPlayerTurn();
    }
    if (playerId === -1) {
        return undefined;
    }
    return room.players[playerId];
}

function getCurrentPlayerId(roomId) {
    return getRoomByIdUnauthorized(roomId).currentPlayerId;
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
    if (field === undefined) {
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
    if (roomId === undefined) {
        throw new Error('RoomService#getPlayersInfoDTO(): roomId undefined.');
    }

    const room = getRoomByIdUnauthorized(roomId);

    let playersDTOs = [];
    room.players.forEach((player, index) => {
        playersDTOs[index] = {id: player.in_room_id, name: player.name, field: player.field_number};
    });
    if (playersDTOs.length === 0) {
        throw new Error('RoomService#getPlayersInfoDTO(): there are no players in the room.');
    }
    if (playersDTOs.length !== room.players.length) {
        throw new Error('RoomService#getPlayersInfoDTO(): creating DTO failed.');
    } else {
        return playersDTOs;
    }
}

function isGameStarted(roomId) {
    return getRoomByIdUnauthorized(roomId).isGameStarted;
}

function markGameAsStarted(roomId) {
    const room = getRoomByIdUnauthorized(roomId);
    room.isGameStarted = true;
    room.numberOfPlayers = room.players.length;
}

function getAllPlayersFromRoom(roomId) {
    return getRoomByIdUnauthorized(roomId).players;
}

function getGameSocketFromRoom(roomId) {
    return getRoomByIdUnauthorized(roomId).socketNamespace.gameSocket;
}

function getNumberOfPlayers(roomId) {
    const numberOfPlayers = getRoomByIdUnauthorized(roomId).numberOfPlayers;
    if (numberOfPlayers === undefined || numberOfPlayers < 2) {
        throw new Error(`RoomService[roomId: ${roomId}]#getNumberOfPlayers: undefined or lower than 2.`);
    }
    return numberOfPlayers;
}

function isRoomExist(roomId) {
    let room;
    try {
        room = getRoomByIdUnauthorized(roomId);
    } catch (err) {
        console.log('RoomService#isRoomExist: catch error: \n start --- [');
        console.log(err);
        console.log("] -- end");
        return false;
    }
    return room !== undefined;
}

/*
* Private function
*/
function getRoomByIdUnauthorized(roomId) {
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