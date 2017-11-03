'use strict';
const PlayerDao = require('./PlayerDao');
//const SocketNamespace = require('../socket/SocketNamespace');
//const RoomService = require('../room/RoomService');
const Player = require('../player/Player');
const RoomService = require('../room/RoomService');

exports.newPlayer = newPlayer;
//exports.saveToDb = saveToDb;
exports.removeFromDb = removeFromDb;

function newPlayer(roomId, socket, name) {
    if (name === undefined || roomId === undefined || socket === undefined) {
        throw new Error('PlayerService#newPlayer(): player name, roomId or socket undefined.');
    }
    const player = new Player(roomId, socket, name);
    RoomService.addPlayerToRoom(player);

    console.log(`PlayerService#newPlayer(): Socket.id: [${socket.id}], name: [${player.name}]`);

    saveToDb(player);

    return player;
}

function saveToDb(player){
    if(player.in_room_id === undefined){
        throw new Error(`PlayerService#saveToDb(): player property undefined`);
    }
    PlayerDao.savePlayer(player.name, player.room_id, player.in_room_id).then((insertedId) => {
        player.setId(insertedId);
    }).catch((reject) => {
        throw reject;
    });
}

function removeFromDb(player) {
    if(player === undefined){
        throw new Error(`PlayerService#deleteFromDb(): player undefined`);
    }
    if(player.id !== undefined) {
        PlayerDao.deleteById(player.id);
    }
}