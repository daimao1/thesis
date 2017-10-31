'use strict';
const PlayerDao = require('./PlayerDao');
//const SocketNamespace = require('../socket/SocketNamespace');
//const RoomService = require('../room/RoomService');
const Player = require('../player/Player');
const RoomService = require('../room/RoomService');

exports.newPlayer = newPlayer;
exports.setPlayerName = setPlayerName;
exports.saveToDb = saveToDb;
exports.removeFromDb = removeFromDb;

function newPlayer(roomId, socket) {
    //TODO insert player to DB and get ID
    if (roomId === undefined || socket === undefined) {
        throw new Error('PlayerService#newPlayer(): roomId or socket undefined.');
    }
    const player = new Player(roomId, socket);
    RoomService.addPlayerToRoom(player);

    console.log(`PlayerService#newPlayer(): Socket.id: ${socket.id}. Player will be saved to database after handle socket event 'setName'.`);

    return player;
}

function setPlayerName(player, name) {
    if (name === undefined || player === undefined) {
        throw new Error('PlayerService#setPlayerName(): player or name undefined.');
        //} else if (name) {// TODO validate length of string
    } else {
        player.setName(name);
    }
}

function saveToDb(player){
    if(player.name === undefined || player.room_id === undefined || player.in_room_id === undefined){
        throw new Error(`PlayerService#saveToDb(): player properties undefined`);
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