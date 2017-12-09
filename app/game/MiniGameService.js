'use strict';
const Constants = require('../utils/Constants');
const RoomService = require('../room/RoomService');
const QuestionService = require('../quiz/question/QuestionService'); //DO NOT REMOVE - loading questions from DB
const ClickerService = require('./ClickerService');
const StopTime = require('./StopTimeService');
const BasicQuizGame = require('./BasicQuizGame');

exports.createDefaultOrder = createDefaultOrder;
exports.startMiniGame = startMiniGame;
exports.getRandomMiniGame = getRandomMiniGame;

/**
 * @param {object} socketNamespace
 * @param {string=} miniGame, if empty, random minigame will be invoked
 */
function startMiniGame(socketNamespace, miniGame) {
    if(miniGame === undefined){
        miniGame = getRandomMiniGame();
    }
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
        default: basicQuiz(socketNamespace);
    }
}

function getRandomMiniGame() {
    const rand = Math.floor(Math.random() * 3 + 1);
    switch(rand) {
        case 1: return Constants.MINI_GAMES.BASIC_QUIZ;
        case 2: return Constants.MINI_GAMES.CLICKER;
        case 3: return Constants.MINI_GAMES.STOP_TIME;
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

