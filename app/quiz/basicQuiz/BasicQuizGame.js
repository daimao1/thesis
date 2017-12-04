"use strict";
const QuizService = require('../QuizService');
const RoomService = require('../../room/RoomService');
const QUESTION_TIME = require('../../utils/Constants').QUESTION_TIME;

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

function getQuizGameByRoomId(roomId) {
    if (gamesMap.has(roomId)) {
        console.log('BasicQuizGame#startGame: this game already have a started quiz.');
        return QuizService.getQuizById(gamesMap.get(roomId));
    } else {
        throw new Error(`BasicQuizGame#getQuizGameByRoomId: cannot find game with roomId [${roomId}].`);
    }
}

function getNamesOfQuizQuestionWinners(quiz) {
    if(quiz.currentQuestion === undefined) {
        throw new Error(`BasicQuizGame[roomId:${quiz.roomId}]#getNamesOfQuizQuestionWinners: current question closed.`);
    }
    const playersDTOs = RoomService.getPlayersDTOs(quiz.roomId);
    if(playersDTOs.length === quiz.playerAnswers.size) {
        const winners = quiz.currentQuestionWinners;
        QuizService.endQuestion(quiz);
        return winners;
    } else {
        return undefined;
    }
}

function getNextQuestion(quiz) {
    const currentQuestion = quiz.currentQuestion;
    const question = QuizService.getNextQuestion(quiz);
    if (question === undefined) {
        endGame(quiz);
        return currentQuestion;
    }
    if(question !== currentQuestion) {
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]#getNextQuestion: new question.`);

        const quizId = {quizId: quiz.id};
        const players = RoomService.getAllPlayersFromRoom(quiz.roomId);
        players.forEach((player) => {
            player.socket.emit('newQuizQuestion', quizId);
        });

        startQuestionTimer(quiz);
    }
    return question;
}

function endQuestionTimer(quiz) {
    if(quiz.currentQuestion !== undefined) {
        const gameSocket = RoomService.getGameSocketFromRoom(quiz.roomId);
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]: emit \'endQuestionTimeServer\' event.`);
        gameSocket.emit('endQuestionTimeServer');
        checkAnswers(quiz);
    } else {
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]#endQuestionTimer: question is already finished.`);
    }
}

function checkAnswers(quiz){
    sendEndQuestionTimeToPlayers(quiz);
    QuizService.checkAnswers(quiz);
    const gameSocket = RoomService.getGameSocketFromRoom(quiz.roomId);
    console.log(`BasicQuizGame[roomId:${quiz.roomId}]: emit \'questionResultsPrepared\' event.`);
    gameSocket.emit('questionResultsPrepared');
}

function sendEndQuestionTimeToPlayers(quiz) {
    const players = RoomService.getAllPlayersFromRoom(quiz.roomId);
    console.log(`BasicQuizGame[roomId:${quiz.roomId}]: emitting \'endQuestionTime\' event to players.`);
    players.forEach((player) => {
        player.socket.emit('endQuestionTime');
    });
}

function startQuestionTimer(quiz) {
    //quiz.questionTimer = QUESTION_TIME;
    const time = QUESTION_TIME * 1000;
    setTimeout(() => {
        endQuestionTimer(quiz);
    }, time);

    let interval = setInterval(()=>{
        const gameSocket = RoomService.getGameSocketFromRoom(quiz.roomId);
        if(gameSocket !== undefined) {
            clearInterval(interval);
            gameSocket.once('endQuestionTimeFE', () => {
                console.log(`BasicQuizGame[roomId:${quiz.roomId}]: handle \'endQuestionTimeFE\' event.`);
                try {
                    checkAnswers(quiz);
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }, 2000);
}

function createEventHandlers(roomId, quiz) {
    const players = RoomService.getAllPlayersFromRoom(roomId);
    players.forEach((player) => {
        quizAnswerHandler(player, quiz, players.length);
    });
}

function quizAnswerHandler(player, quiz, numberOfPlayers) {
    player.socket.once('quizAnswer', (quizAnswerData) => {
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]: handle \'quizAnswer\' event - saving quiz answer.`);
        //if (+quizAnswerData.quizId === quiz.id) { //TODO set quiz id
        let answerId;
        switch (quizAnswerData.answer) {
            case "a":
                answerId = 0;
                break;
            case "b":
                answerId = 1;
                break;
            case "c":
                answerId = 2;
                break;
            case "d":
                answerId = 3;
                break;
            default:
                answerId = -1;
        }

        emitSocketToQuiz(player.in_room_id, player.room_id);
        quiz.playerAnswers.set(player.in_room_id, answerId);
        //}
        checkIfAllPlayersAnswered(quiz, numberOfPlayers);
    });
}

function emitSocketToQuiz(playerId, roomId) {
    const gameSocket = RoomService.getGameSocketFromRoom(roomId);
    console.log(`BasicQuizGame[roomId:${roomId}]: emit \'playerQuizAnswer\' event.`);
    gameSocket.emit('playerQuizAnswer', playerId);
}

function checkIfAllPlayersAnswered(quiz, numberOfPlayers) {
    if (quiz.playerAnswers.size === numberOfPlayers) {
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]: all players answered.`);
        checkAnswers(quiz);
    }
}

function endGame(quiz) {
    const playersOrder = QuizService.collectResults(quiz);
    RoomService.setPlayersOrderFromMiniGame([...playersOrder], quiz.roomId);
    setTimeout(()=>{
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]: deleting finished quiz.`);
        gamesMap.delete(quiz.roomId);
    }, 60000); //delete quiz after 60 seconds
}