'use strict';
const Constants = require('../Constants');
const RoomService = require('../room/RoomService');
const QuestionService = require('../quiz/question/QuestionService'); //DO NOT REMOVE - loading questions
const ClickerService = require('./ClickerService');

exports.startMiniGame = function (miniGame, socketNamespace) {

    switch (miniGame) {
        case Constants.MINI_GAMES.BASIC_QUIZ:
            basicQuiz(socketNamespace);
            break;
        case Constants.MINI_GAMES.STOP_TIME:
            stopTime(socketNamespace);
            break;
        case Constants.MINI_GAMES.CLICKER:
            clicker(socketNamespace);
            break;
        default:  mockMiniGame(socketNamespace.roomId);
    }
};

function basicQuiz(socketNamespace) {
    //TODO quiz invoking
}

function clicker(socketNamespace) {
    ClickerService.initClicker(socketNamespace);
}

function stopTime(socketNamespace) {

    const playersDTOs = RoomService.getPlayersDTOs(socketNamespace.roomId);
    socketNamespace.gameSocket.emit('playersInfo', playersDTOs);
    socketNamespace.gameSocket.on('stopTimeGameReady', function () {
        console.log('MiniGameService#stopTime(): stop-time-game ready.');

        const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
        players.forEach( (player) => {
            player.socket.on('stopButton', () => {
                socketNamespace.gameSocket.emit('stopTime', player.in_room_id);
            });
        });
    });

    let orderFromMiniGame = createDefaultOrder(socketNamespace.roomId);
    RoomService.setPlayersOrderFromMiniGame([...orderFromMiniGame], socketNamespace.roomId);
    console.log(`SocketEventService#startMiniGame(): start mini-game in room[${socketNamespace.roomId}]...`);
}

function mockMiniGame(roomId) {
    let orderFromMiniGame = createDefaultOrder(roomId);
    RoomService.setPlayersOrderFromMiniGame([...orderFromMiniGame], roomId);
}

function createDefaultOrder(roomId) {
    const playersOrder = [];
    const playersDTOs = RoomService.getPlayersDTOs(roomId);
    for (let i = 0, len = playersDTOs.length; i < len; i++) {
        playersOrder.push(i);
    }
    return playersOrder;
}

