'use strict';
const PlayerDao = require('./PlayerDao');
const Player = require('../player/Player');
const RoomService = require('../room/RoomService');

exports.newPlayer = newPlayer;
exports.removeFromDb = removeFromDb;
exports.updateAllPlayersFromRoom = updateAllPlayersFromRoom;
exports.findPlayersFromRoomInDatabase = findPlayersFromRoomInDatabase;
exports.connectSocketToExistingPlayer = connectSocketToExistingPlayer;

/**
 *
 * @param {number} roomId
 * @param {object} socket
 * @param {string} name
 * @param {string=} deviceName
 * @returns {Player}
 */
function newPlayer(roomId, socket, name, deviceName) {
    if (name === undefined || roomId === undefined || socket === undefined) {
        throw new Error('PlayerService#newPlayer(): player name, roomId or socket undefined.');
    }
    if (deviceName === undefined) {
        deviceName = "Android";
    }
    const player = new Player(undefined, roomId, socket, name, deviceName);
    RoomService.addPlayerToRoom(player);

    console.log(`PlayerService#newPlayer(): Socket.id: [${socket.id}], name: [${player.name}]`);

    saveToDb(player);

    return player;
}

function saveToDb(player) {
    if (player.in_room_id === undefined) {
        throw new Error(`PlayerService#saveToDb(): player property undefined`);
    }
    PlayerDao.savePlayer(player.name, player.room_id, player.in_room_id, player.device_name).then((insertedId) => {
        player.setId(insertedId);
    }).catch((reject) => {
        throw reject;
    });
}

function removeFromDb(player) {
    if (player === undefined) {
        throw new Error(`PlayerService#deleteFromDb(): player undefined`);
    }
    if (player.id !== undefined) {
        PlayerDao.deleteById(player.id).catch(reject => {
            throw reject;
        });
    }
}

function updateAllPlayersFromRoom(roomId) {
    const players = RoomService.getAllPlayersFromRoom(roomId);
    players.forEach(player => {
        PlayerDao.updatePlayer(player).then((rows) => {
            if (rows[0] !== undefined) {
                console.log(`PlayerService#updateAllPlayersFromRoom query returned object: ${rows[0]}.`);
            }
        }).catch(reject => {
            throw reject;
        });
    });
}

function findPlayersFromRoomInDatabase(roomId) {
    PlayerDao.findByRoomId(roomId).then(rows => {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i] !== undefined && rows[i].in_room_id === i) {
                const player = new Player(rows[i].id, rows[i].room_id, undefined, rows[i].name, rows[i].device_name, rows[i].field_number);
                RoomService.addPlayerToRoom(player);
            } else {
                throw new Error(`PlayerService#findPlayersFromRoomInDatabase[${roomId}]: incorrect row: ${rows[i]}`);
            }
        }
    }).catch(reject => {
        throw reject;
    });
}

function connectSocketToExistingPlayer(socket, roomId, playerName, playerDeviceName) {
    const players = RoomService.getAllPlayersFromRoom(roomId);
    for(let i = 0; i < players.length; i++){
        if(players[i].name === playerName && players[i].device_name === playerDeviceName) {
            players[i].socket = socket;
            return players[i];
        }
    }
    throw new Error(`PlayerService#connectSocketToExistingPlayer[${roomId}]: ` +
        `cannot find player with this name and device_name in this room.`);
}