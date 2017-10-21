'use strict';
//const RoomDao = require('./RoomDao');
//const SocketNamespace = require('../socket/SocketNamespace');
//const RoomService = require('../room/RoomService');
const Player = require('../player/Player');
//const RoomService = require('../room/RoomService');

exports.newPlayer = newPlayer;
exports.setPlayerName = setPlayerName;

function newPlayer(roomId, socket) {
    //TODO insert player to DB and get ID
    const player = new Player(1, 1, roomId, socket);
    console.log(`PlayerService: new player. Socket.id: ${socket.id}`);
    return player;
}

function setPlayerName(player, name) {
    if (name === undefined || player === undefined) {
        throw new TypeError('PlayerService#setPlayerName(): player or name undefined.');
    //} else if (name) {// TODO check length of string
    } else {
        player.setName = name;
    }
}