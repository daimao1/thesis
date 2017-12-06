'use strict';
const Constants = require('../utils/Constants');
const RoomService = require('../room/RoomService');
const QuestionService = require('../quiz/question/QuestionService'); //DO NOT REMOVE - loading questions from DB
const ClickerService = require('./ClickerService');
const StopTime = require('./StopTimeService');
const BasicQuizGame = require('./BasicQuizGame');

exports.createDefaultOrder = createDefaultOrder;
exports.startMiniGame = startMiniGame;


/**
 * @param {object} socketNamespace
 * @param {string=} miniGame, if empty, random minigame will be invoked
 */
function startMiniGame(socketNamespace, miniGame) {

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
        default:  startRandomMinigame(socketNamespace.roomId);
    }
}

function startRandomMinigame(socketNamespace) {
    const rand = Math.floor(Math.random() * 2 + 1);
    switch(rand) {
        case 1: basicQuiz(socketNamespace); break;
        case 2: clicker(socketNamespace); break;
    }
}

function basicQuiz(socketNamespace) {
    BasicQuizGame.startGame(socketNamespace);
}

function clicker(socketNamespace) {
    ClickerService.initClicker(socketNamespace);
}

function stopTime(socketNamespace) {
    StopTime.initGame(socketNamespace);
}

// function mockMiniGame(roomId) {
//     let orderFromMiniGame = createDefaultOrder(roomId);
//     RoomService.setPlayersOrder([...orderFromMiniGame], roomId);
// }

function createDefaultOrder(roomId) {
    const playersOrder = [];
    const playersDTOs = RoomService.getPlayersDTOs(roomId);
    for (let i = 0, len = playersDTOs.length; i < len; i++) {
        playersOrder.push(i);
    }
    return playersOrder;
}

