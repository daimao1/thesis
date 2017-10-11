'use strict';
//const RoomDao = require('./RoomDao');
//const SocketNamespace = require('../socket/SocketNamespace');
//const RoomService = require('../room/RoomService');
const Player = require('../player/Player');
//const RoomService = require('../room/RoomService');

exports.newPlayer = newPlayer;

function newPlayer(roomId, socket) {
    //TODO insert player to DB and get ID
    const player = new Player(1, 'imie', 1, roomId, socket);
    console.log(`PlayerService: new player. Socket.id: ${socket.id}`);
    return player;
}