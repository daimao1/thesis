'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');
const Constants = require('../utils/Constants');
const MiniGameService = require('../game/MiniGameService');
const BoardService = require('../game/BoardService');

exports.initBasicHandlers = initBasicHandlers;

function initBasicHandlers(socket, socketNamespace) {

    socket.on('error', (error) => {
        console.error('SocketEventService: socket connection error:');
        throw error;
    });

    socket.on('player', (playerData) => {
        if (RoomService.isGameStarted(socketNamespace.roomId)) {
            try {
                resumeConnectionWithPlayer(socket, socketNamespace, playerData.name, playerData.device_name);
            } catch (error) {
                console.error(error);
                console.log('SocketEventService#onPlayerEvent: disconnect unknown player.');
                socket.disconnect();
            }
        } else {
            try {
                newPlayer(socket, socketNamespace, playerData.name, playerData.device_name);
            } catch (error) {
                console.error(error);
            }
        }
    });

    socket.on('markQuiz', (id) => {
        if (id === socketNamespace.roomId) {
            socketNamespace.gameSocket = socket;
            MiniGameService.startMiniGame(socketNamespace, Constants.MINI_GAMES.BASIC_QUIZ);
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
        BoardService.initGame(socketNamespace);
    });

    socket.on('markStopTimeGame', () => {
        socketNamespace.gameSocket = socket;
        MiniGameService.startMiniGame(socketNamespace, Constants.MINI_GAMES.STOP_TIME);
    });

    socket.on('markClicker', (roomId) => {
        if (roomId === socketNamespace.roomId) {
            socketNamespace.gameSocket = socket;
            MiniGameService.startMiniGame(socketNamespace, Constants.MINI_GAMES.CLICKER);
        }
    });
}

function newPlayer(socket, socketNamespace, name, deviceName) {
    socket.join('players');
    console.log('SocketEventHandler: handle \'player\' event - creating new player.');
    const player = PlayerService.newPlayer(socketNamespace.roomId, socket, name, deviceName);
    //addPlayerDisconnectHandler(player);
    BoardService.onPlayerDiceValue(player, socketNamespace);
}

function resumeConnectionWithPlayer(socket, socketNamespace, playerName, playerDeviceName) {
    const player = PlayerService.connectSocketToExistingPlayer(socket, socketNamespace.roomId, playerName, playerDeviceName);
    socket.join('players');
    //addPlayerDisconnectHandler(player);
    BoardService.onPlayerDiceValue(player, socketNamespace);
    RoomService.areAllPlayersConnected(socketNamespace.roomId);
    console.log('SocketEventService#onPlayerEvent: resumed connection with player.');
}

function addPlayerDisconnectHandler(player) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: player disconnected. RoomID: [${player.room_id}], inRoomId: [${player.in_room_id}]`);

        setTimeout(() => {
            RoomService.removePlayer(player);
            PlayerService.removeFromDb(player);
        }, 60 * 1000);
    });
}

function addGameDisconnectHandler(socketNamespace) {
    socketNamespace.gameSocket.on('disconnect', () => {
        console.log(`SocketEventService: room[${socketNamespace.roomId}] game disconnect.`);
    });
}