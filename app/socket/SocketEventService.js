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
        try {
            newPlayer(socket, socketNamespace, playerData.name, playerData.device_name);
        } catch (error) {
            console.error(error);
        }
    });

    socket.on('markQuiz', (id) => {
        if (id === socketNamespace.roomId) {
            socketNamespace.gameSocket = socket;
            MiniGameService.startMiniGame(Constants.MINI_GAMES.BASIC_QUIZ, socketNamespace);
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
        MiniGameService.startMiniGame(Constants.MINI_GAMES.STOP_TIME, socketNamespace);
    });

    socket.on('markClicker', (roomId) => {
        if (roomId === socketNamespace.roomId) {

            //TODO this block is only for test here
            if (RoomService.isGameStarted(roomId)) {
                console.log(`SocketEventService: room[${socketNamespace.roomId}] game (board) resumed.`);
            } else {
                RoomService.markGameAsStarted(roomId);
                console.log('SocketEventService: new game started.');
            }
            //end

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

    BoardService.onPlayerDiceValue(player, socketNamespace);
}

function addPlayerDisconnectHandler(player) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: player disconnected. RoomID: [${player.room_id}], inRoomId: [${player.in_room_id}]`);

        setTimeout( ()=> {
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