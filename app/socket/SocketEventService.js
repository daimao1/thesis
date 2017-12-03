'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');
const Constants = require('../Constants');
const MiniGameService = require('../game/MiniGameService');

exports.initBasicHandlers = initBasicHandlers;
exports.sendPlayersInfoToGame = sendPlayersInfoToGame;

function initBasicHandlers(socket, socketNamespace) {

    socket.on('error', (error) => {
        console.error('SocketEventService: socket connection error:');
        throw error;
    });

    socket.on('player', (playerData) => {
        try {
            newPlayer(socket, socketNamespace, playerData.name, playerData.device_name);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('markQuiz', (id) => {
        if (id === socketNamespace.roomId) {
            socketNamespace.gameSocket = socket;
        }
    });

    socket.on('markGame', () => {
        if (RoomService.isGameStarted(socketNamespace.roomId)) {
            console.log(`SocketEventService: room[${socketNamespace.roomId}] game (board) resumed.`);
        } else {
            RoomService.markGameAsStarted(socketNamespace.roomId);
            console.log('SocketEventService: new game started.');
        }
        socketNamespace.gameSocket = socket;
        addGameDisconnectHandler(socketNamespace);
        addGameDefaultHandlers(socketNamespace);
        sendPlayersInfoToGame(socketNamespace);
    });

    socket.on('markStopTimeGame', () => {
        socketNamespace.gameSocket = socket;
        MiniGameService.startMiniGame(Constants.MINI_GAMES.STOP_TIME, socketNamespace);
    });

    socket.on('markClicker', (roomId) => {
        if (roomId === socketNamespace.roomId) {
            socketNamespace.gameSocket = socket;
            MiniGameService.startMiniGame(Constants.MINI_GAMES.CLICKER, socketNamespace);
        }
    });
}

function newPlayer(socket, socketNamespace, name, deviceName) {
    socket.join('players');
    console.log('SocketEventHandler: handle \'playerName\' event - creating new player.');
    const player = PlayerService.newPlayer(socketNamespace.roomId, socket, name, deviceName);
    addPlayerDisconnectHandler(player);

    player.socket.on('diceValue', function (value) {
        const currentPlayerId = RoomService.getCurrentPlayerId(socketNamespace.roomId);
        if (currentPlayerId === player.in_room_id) {
            socketNamespace.gameSocket.emit('playerDice', value);
        }
    });
}

function addPlayerDisconnectHandler(player) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: player disconnected. RoomID: [${player.room_id}], inRoomId: [${player.in_room_id}]`);

        setTimeout( ()=> {
            RoomService.removePlayer(player);
            PlayerService.removeFromDb(player);
        }, 100000);
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

function addGameDefaultHandlers(socketNamespace) {
    socketNamespace.gameSocket.on('gameReady', function () {
        try {
            MiniGameService.startMiniGame('mockMiniGame', socketNamespace);
        } catch (error) {
            console.error(error);
        }

        nextPlayerTurn(socketNamespace);

        socketNamespace.gameSocket.on('endPlayerTurn', (playerToSaveId, field) => {
            RoomService.endTurn(socketNamespace.roomId);
            RoomService.saveGameState(playerToSaveId, field, socketNamespace.roomId);
            nextPlayerTurn(socketNamespace);
        });
    });

    socketNamespace.gameSocket.on('specialGrid', function (gridData) {
        if (gridData.gridName === Constants.SPECIAL_GRIDS.CHALLENGE4) {
            challenge(4, socketNamespace, gridData.playerId);
        } else if (gridData.gridName === Constants.SPECIAL_GRIDS.CHALLENGE5) {
            challenge(5, socketNamespace, gridData.playerId);
        } else if (gridData.gridName === Constants.SPECIAL_GRIDS.CHALLENGE6) {
            challenge(6, socketNamespace, gridData.playerId);
        }
    });
}

function challenge(challengeType, socketNamespace, playerId) {
    const player = RoomService.getPlayerFromRoom(socketNamespace.roomId, playerId);
    player.socket.emit('challengeDice');
    player.socket.once('challengeDiceValue', (value) => {
        if (value >= challengeType) {
            socketNamespace.gameSocket.emit('challengeResult', true, player.in_room_id);
        } else {
            socketNamespace.gameSocket.emit('challengeResult', false, player.in_room_id);
        }
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

    //Invoke android activity with 0,5 sec delay
    setTimeout(() => {
        if (player.extraDices === 2) {
            socketNamespace.namespace.to(player.socket.id).emit('threeDices');
        } else if (player.extraDices === 1) {
            socketNamespace.namespace.to(player.socket.id).emit('twoDices');
        } else {
            socketNamespace.namespace.to(player.socket.id).emit('dice');
        }
    }, 500);
}