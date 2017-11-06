'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');

//exports.addDisconnectHandler = addDisconnectHandler;
//exports.addPlayerNameHandler = addPlayerNameHandler;

exports.initBasicHandlers = initBasicHandlers;
exports.sendPlayersInfoToGame = sendPlayersInfoToGame;

function initBasicHandlers(socket, socketNamespace){
    socket.on('playerName', (playerName) => {
        newPlayer(socket, socketNamespace, playerName);
    });


    //TODO it is possible to change this to socket.handshake
    socket.on('markGame', () => {
       newGame(socket, socketNamespace);
    });
}

function newPlayer(socket, socketNamespace, name){
    socket.join('players');
    console.log('SocketEventHandler: handle \'setName\' event - creating new player.');
    const player = PlayerService.newPlayer(socketNamespace.roomId, socket, name);
    addPlayerDisconnectHandler(player);
    addPlayerDefaultHandlers(player, socketNamespace);
}

function newGame(socket, socketNamespace){
    console.log('SocketIO/N/EventHandler: game connection initialized.');
    socketNamespace.gameSocket = socket;
    addGameDisconnectHandler(socket);
    addGameDefaultHandlers(socketNamespace);
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
        //TODO implement
        throw new Error('Game socket disconnected! Not implemented!');
    });
}

function sendPlayersInfoToGame(socket, playersInfo){
    if(playersInfo === undefined) {
        throw new Error('SocketEventService#sendRoomInfoToGame(): playersInfo undefined.');
    }
    socket.emit('playersInfo', playersInfo);
}

function addPlayerDefaultHandlers(player, socketNamespace){

    //TODO after jump to StopTimeGame
    player.socket.on('stopButton', function () {
        socketNamespace.gameSocket.emit('stopTime', player.in_room_id);
    });
    player.socket.on('diceValue', function (value) {
        socketNamespace.gameSocket.emit('playerDice', {id: player.in_room_id, value: value});
    });
}

function addGameDefaultHandlers(socketNamespace) {
    socketNamespace.gameSocket.on('specialGrid', function (gridData) {
        const playerToNotify = RoomService.getPlayerFromRoom(socketNamespace.roomId, gridData.playerId);
        playerToNotify.socket.emit('specialGrid', gridData.gridName);
    });
}