'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');

//exports.addDisconnectHandler = addDisconnectHandler;
//exports.addPlayerNameHandler = addPlayerNameHandler;

exports.initBasicHandlers = initBasicHandlers;

function initBasicHandlers(player, socketNamespace){
    addDisconnectHandler(player, socketNamespace);
    addPlayerNameHandler(player);
}

function addDisconnectHandler(player, socketNamespace) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: Socket namespace id[${socketNamespace.roomId}]: client disconnected: socket.id = [${player.socket.id}]`);
        RoomService.removePlayer(socketNamespace, player);
        PlayerService.removeFromDb(player);
    });
}

function addPlayerNameHandler(player) {
    player.socket.on('setName', (object) => {
        console.log('SocketEventHandler: handle \'setName\' event.');
        PlayerService.setPlayerName(player, object.name);
        PlayerService.saveToDb(player);
    });
}