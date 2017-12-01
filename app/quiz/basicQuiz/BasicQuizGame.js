"use strict";
const QuizService = require('../QuizService');
const RoomService = require('../../room/RoomService');

let gamesMap = new Map();

exports.startGame = startGame;
exports.getNextQuestion = getNextQuestion;
exports.getQuizGameByRoomId = getQuizGameByRoomId;
exports.getNamesOfQuizQuestionWinners = getNamesOfQuizQuestionWinners;

function startGame(roomId) {
    if (gamesMap.has(roomId)) {
        console.log('BasicQuizGame#startGame: this game already have a started quiz.');
        return QuizService.getQuizById(gamesMap.get(roomId));
    }
    console.log("BasicQuizGame#startGame.");
    const quiz = QuizService.createQuiz(1, roomId);
    gamesMap.set(roomId, quiz.id);
    createEventHandlers(roomId, quiz);
    quiz.playerAnswers.clear();
    return quiz;
}

function getQuizGameByRoomId(roomId){
    if (gamesMap.has(roomId)) {
        console.log('BasicQuizGame#startGame: this game already have a started quiz.');
        return QuizService.getQuizById(gamesMap.get(roomId));
    } else {
        throw new Error(`BasicQuizGame#getQuizGameByRoomId: cannot find game with roomId [${roomId}].`);
    }
}

function getNamesOfQuizQuestionWinners(quiz) {
    //if(quiz.currentQuestion === undefined) {
        return quiz.currentQuestionWinners;
    //}
}

function getNextQuestion(quizId, quiz) {
    if(quiz.currentQuestion !== undefined){
        return quiz.currentQuestion;
    }
    quiz.currentQuestionWinners = [];
    const question = QuizService.getNextQuestion(quizId, quiz);
    if (question === undefined) {
        endGame(quiz);
    }
    return question;
}

function createEventHandlers(roomId, quiz) {
    const players = RoomService.getAllPlayersFromRoom(roomId);
    players.forEach((player) => {
        quizAnswerHandler(player, quiz, players.length);
    });
}

function quizAnswerHandler(player, quiz, numberOfPlayers) {
    player.socket.once('quizAnswer', (quizAnswerData) => {
        console.log('BasicQuizGame: handle \'quizAnswer\' event - saving quiz answer.');
        //if (+quizAnswerData.quizId === quiz.id) { //TODO set quiz id
        let answerId;
        switch(quizAnswerData.answer){
            case "a": answerId = 0; break;
            case "b": answerId = 1; break;
            case "c": answerId = 2; break;
            case "d": answerId = 3; break;
            default: answerId = 0;
        }

        emitSocketToQuiz(player.in_room_id, player.room_id);
        quiz.playerAnswers.set(player.in_room_id, answerId);
        //}
        checkIfAllPlayersAnswered(quiz, numberOfPlayers);
    });
}

function emitSocketToQuiz(playerId, roomId) {
    const gameSocket = RoomService.getGameSocketFromRoom(roomId);
    gameSocket.emit('playerQuizAnswer', playerId);
}

function checkIfAllPlayersAnswered(quiz, numberOfPlayers) {
    if (quiz.playerAnswers.size === numberOfPlayers) {
        endQuestion(quiz);
    }
}

function endQuestion(quiz) {
    quiz.playerAnswers.forEach((answerId, playerId) => {
        if (quiz.currentQuestion.answers[answerId] === quiz.currentQuestion.correct_answer) {
            quiz.playerScores.set(playerId, quiz.playerScores.get(playerId) + 1);
            const player = RoomService.getPlayerFromRoom(quiz.roomId, playerId);
            quiz.currentQuestionWinners.push(player.name);
        }
    });
    //quiz.currentQuestion = undefined; //TODO
}

function endGame(quiz) {
    collectResults(quiz);
    gamesMap.delete(quiz.roomId);
}

function collectResults(quiz) {
    let playerScores = [];
    for (let i = 0; i < quiz.playerScores.size; i++) {
        playerScores[i] = quiz.playerScores.get(i);
    }
    const sortedPlayerScores = playerScores.slice();
    sortedPlayerScores.sort(compareNumbers).reverse();

    let playersOrder = [];

    for (let i = 0; i < quiz.playerScores.size; i++) {
        let index = playerScores.indexOf(sortedPlayerScores[i]);
        playerScores[index] = -1;
        playersOrder[i] = index;
    }
    quiz.playersOrder = playersOrder;
    return playersOrder;
}

function compareNumbers(a, b) {
    return a - b;
}