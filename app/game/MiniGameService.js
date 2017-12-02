'use strict';
const Constants = require('../Constants');
const RoomService = require('../room/RoomService');
const StopTime = require('./StopTimeService');

exports.startMiniGame = function (miniGame, socketNamespace) {

    switch (miniGame) {
        case Constants.MINI_GAMES.BASIC_QUIZ:
            basicQuiz(socketNamespace);
            break;
        case Constants.MINI_GAMES.STOP_TIME:
            stopTime(socketNamespace);
            break;
        default:
            mockMiniGame(socketNamespace.roomId);
    }
};

function basicQuiz(socketNamespace) {
    //TODO quiz invoking
}

function stopTime(socketNamespace) {
    StopTime.initGame(socketNamespace);
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

