'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');
const Constants = require('../Constants');
const MiniGameService = require('../game/MiniGameService');

exports.initBasicHandlers = initBasicHandlers;
exports.sendPlayersInfoToGame = sendPlayersInfoToGame;

function initBasicHandlers(socket, socketNamespace) {
    socket.on('playerName', (playerName) => {
        newPlayer(socket, socketNamespace, playerName);
    });

    socket.on('markGame', () => {
        if(RoomService.isGameStarted(socketNamespace.roomId)) {
            console.log(`SocketEventService: room[${socketNamespace.roomId}] game (board) resumed.`);
        } else {
            RoomService.markGameAsStarted(socketNamespace.roomId);
            console.log('SocketEventService: new game board started.');
        }
        socketNamespace.gameSocket = socket;
        addGameDisconnectHandler(socketNamespace);
        addGameDefaultHandlers(socketNamespace);
        sendPlayersInfoToGame(socketNamespace);
    });

    socket.on('markStopTimeGame', ()=> {
        socketNamespace.gameSocket = socket;
        MiniGameService.startMiniGame(Constants.MINI_GAMES.STOP_TIME, socketNamespace);
    });
}

function newPlayer(socket, socketNamespace, name) {
    socket.join('players');
    console.log('SocketEventHandler: handle \'playerName\' event - creating new player.');
    const player = PlayerService.newPlayer(socketNamespace.roomId, socket, name);
    addPlayerDisconnectHandler(player);
    addPlayerDefaultHandlers(player, socketNamespace);
}

function addPlayerDisconnectHandler(player) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: player disconnected. RoomID: [${player.room_id}], inRoomId: [${player.in_room_id}]`);
        RoomService.removePlayer(player);
        PlayerService.removeFromDb(player);
    });
}

function addGameDisconnectHandler(socketNamespace) {
    socketNamespace.gameSocket.on('disconnect', () => {
        console.log(`SocketEventService: room[${socketNamespace.roomId}] game disconnect.`);
        //throw new Error('Game socket disconnected! Not implemented!');
    });
}

function sendPlayersInfoToGame(socketNamespace) {
    if (socketNamespace === undefined) {
        throw new Error('SocketEventService#sendRoomInfoToGame(): socketNamespace undefined.');
    }
    socketNamespace.gameSocket.emit('playersInfo', RoomService.getPlayersDTOs(socketNamespace.roomId));
}

function addPlayerDefaultHandlers(player, socketNamespace) {

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
        // gridData === Constants.MINI_GAMES.STOP_TIME
        const playerToNotify = RoomService.getPlayerFromRoom(socketNamespace.roomId, gridData.playerId);
        playerToNotify.socket.emit('specialGrid', gridData.gridName);
    });

    socketNamespace.gameSocket.on('gameReady', function () {
        try {
            MiniGameService.startMiniGame('mockMiniGame', socketNamespace);
        } catch(error) {
            console.error(error);
        }
        nextPlayerTurn(socketNamespace);

        socketNamespace.gameSocket.on('endPlayerTurn', (playerToSaveId, field) => {
            RoomService.endTurn(socketNamespace.roomId);
            RoomService.saveGameState(playerToSaveId, field, socketNamespace.roomId);
            nextPlayerTurn(socketNamespace);
        });

        //Next you have to wait for diceValue event from player.
        //When this player send a event to you, then you have to send playerDice event to the game.
        //If think that i have to wait for signal from game that this player end his move?
        //Exactly, and init move of the next player. If this was last player, then you have to end this round, and init next minigame.
    });
}

function nextPlayerTurn(socketNamespace) {
    let player = RoomService.nextPlayerTurn(socketNamespace.roomId);
    if (player === undefined) {
        RoomService.endRound(socketNamespace.roomId);
        MiniGameService.startMiniGame('default', socketNamespace);
        player = RoomService.nextPlayerTurn(socketNamespace.roomId);
    }
    if (player.in_room_id > -1 && player.in_room_id < Constants.MAX_PLAYERS) {
        socketNamespace.gameSocket.emit('nextPlayerTurn', player.in_room_id);
        socketNamespace.namespace.to('players').emit('playerTurn', {playerName: player.name});
    } else {
        throw new Error('SocketEventService#nextPlayerTurn: player undefined.');
    }

    //Notify android about mini-game with 1 sec delay
    setTimeout(() => {
        if(player.extraDices === 2) {
            socketNamespace.namespace.to(player.socket.id).emit('threeDices');
        } else if(player.extraDices === 1) {
            socketNamespace.namespace.to(player.socket.id).emit('twoDices');
        } else {
            socketNamespace.namespace.to(player.socket.id).emit('dice');
        }
    }, 1000);
}