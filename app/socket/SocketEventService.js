'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');

exports.addDisconnectHandler = addDisconnectHandler;
exports.addPlayerNameHandler = addPlayerNameHandler;

function addDisconnectHandler(player, socketNamespace) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: Socket namespace id[${player.roomId}]: client disconnected: socket.id = [${player.socket.id}]`);
        RoomService.removePlayer(socketNamespace, player);
    });
}

function addPlayerNameHandler(player) {
    player.socket.on('setName', () => {
        PlayerService.setPlayerName(player, name);
    });
}
