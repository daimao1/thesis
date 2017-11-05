'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');

//exports.addDisconnectHandler = addDisconnectHandler;
//exports.addPlayerNameHandler = addPlayerNameHandler;

exports.initBasicHandlers = initBasicHandlers;
exports.sendPlayersInfoToGame = sendPlayersInfoToGame;

function initBasicHandlers(socket, socketNamespace){
    socket.on('setName', (object) => {
        newPlayer(socket, socketNamespace, object.name);
    });

    socket.on('markGame', () => {
       newGame(socket, socketNamespace);
    });
}

function newPlayer(socket, socketNamespace, name){
    console.log('SocketEventHandler: handle \'setName\' event - creating new player.');
    //socket.isPlayer = true;
    const player = PlayerService.newPlayer(socketNamespace.roomId, socket, name);
    addPlayerDisconnectHandler(player);
}

function newGame(socket, socketNamespace){
    console.log('SocketIO/N/EventHandler: connection to game initialized.');
    //socket.isPlayer = false;
    socketNamespace.gameSocket = socket;
    addGameDisconnectHandler(socket);
}


function addPlayerDisconnectHandler(player) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: player disconnected. RoomID: [${player.room_id}], inRoomId: [${player.in_room_id}]`);
        RoomService.removePlayer(player);
        PlayerService.removeFromDb(player);
    });
}

function addGameDisconnectHandler(socket){
    socket.on('disconnect', () => {
        //TODO something with it
        throw new Error('Game socket disconnected!');
    });
}

function sendPlayersInfoToGame(socket, playersInfo){
    if(socket === undefined) {
        throw new Error('SocketEventService#sendRoomInfoToGame(): socket undefined');
    }
    socket.emit('playersInfo', playersInfo);
}