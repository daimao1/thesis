'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');
const Constants = require('../Constants');

exports.initBasicHandlers = initBasicHandlers;
exports.sendPlayersInfoToGame = sendPlayersInfoToGame;

function initBasicHandlers(socket, socketNamespace){
    socket.on('playerName', (playerName) => {
        newPlayer(socket, socketNamespace, playerName);
    });

    socket.on('markGame', () => {
       newGame(socket, socketNamespace);
    });
}

function newPlayer(socket, socketNamespace, name){
    socket.join('players');
    console.log('SocketEventHandler: handle \'playerName\' event - creating new player.');
    const player = PlayerService.newPlayer(socketNamespace.roomId, socket, name);
    addPlayerDisconnectHandler(player);
    addPlayerDefaultHandlers(player, socketNamespace);
}

function newGame(socket, socketNamespace){
    console.log('SocketIO/N/EventHandler: game connection initialized.');
    socketNamespace.gameSocket = socket;
    addGameDisconnectHandler(socket);
    sendPlayersInfoToGame(socketNamespace);
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

function sendPlayersInfoToGame(socketNamespace){
    if(socketNamespace === undefined) {
        throw new Error('SocketEventService#sendRoomInfoToGame(): socketNamespace undefined.');
    }

    const playersInfo = RoomService.getPlayersInfoDTO(socketNamespace.roomId);
    socketNamespace.gameSocket.emit('playersInfo', playersInfo);
}

function addPlayerDefaultHandlers(player, socketNamespace){

    //TODO after jump to StopTimeGame
    player.socket.on('stopButton', function () {
        socketNamespace.gameSocket.emit('stopTime', player.in_room_id);
    });
    player.socket.on('diceValue', function (value) {
        socketNamespace.gameSocket.emit('playerDice', value);
    });
}

function addGameDefaultHandlers(socketNamespace) {
    socketNamespace.gameSocket.on('specialGrid', function (gridData) {
        const playerToNotify = RoomService.getPlayerFromRoom(socketNamespace.roomId, gridData.playerId);
        playerToNotify.socket.emit('specialGrid', gridData.gridName);
    });

    socketNamespace.gameSocket.on('gameReady', function () {
        const orderFromMinigame = [];
        const playersDTOs = RoomService.getPlayersInfoDTO(socketNamespace.roomId);
        for (let i = 0, len = playersDTOs.length; i < len; i++) {
            orderFromMinigame.push(i);
        }
        RoomService.setPlayersOrderFromMinigame([...orderFromMinigame], socketNamespace.roomId);
        let playerTurnId = RoomService.nextPlayerTurn(socketNamespace.roomId);
        socketNamespace.gameSocket.emit('nextPlayerTurn', playerTurnId);

        socketNamespace.gameSocket.on('endPlayerTurn', () => {
            let playerId = RoomService.nextPlayerTurn(socketNamespace.roomId);
            //if it was last player - start new round
            if (playerId === -1) {
                RoomService.endRound(socketNamespace.roomId);
                //new minigame
                RoomService.setPlayersOrderFromMinigame([...orderFromMinigame], socketNamespace.roomId);
                playerId = RoomService.nextPlayerTurn(socketNamespace.roomId);
            }
            if (playerId > -1 && playerId < Constants.MAX_PLAYERS){
                socketNamespace.gameSocket.emit('nextPlayerTurn', playerId);
            }
        });

        //Next you have to wait for diceValue event from player.
        //When this player send a event to you, then you have to send playerDice event to the game.
        //If think that i have to wait for signal from game that this player end his move?
        //Exactly, and init move of the next player. If this was last player, then you have to end this round, and init next minigame.
    });
}