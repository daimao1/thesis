"use strict";
const QuizService = require('../QuizService');
const RoomService = require('../../room/RoomService');
const QUESTION_TIME = require('../../Constants').QUESTION_TIME;

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
    //if(quiz.currentQuestion === undefined) {
    return quiz.currentQuestionWinners;
    //}
}

function getNextQuestion(quiz) {
    const currentQuestion = quiz.currentQuestion;
    const question = QuizService.getNextQuestion(quiz);
    if (question === undefined) {
        endGame(quiz);
        return undefined;
    }
    if(question !== currentQuestion) {
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]#getNextQuestion: new question sent.`);
        startQuestionTimer(quiz);
    }
    return question;
}

function endQuestion(quiz) {
    if(quiz.currentQuestion !== undefined) {
        const gameSocket = RoomService.getGameSocketFromRoom(quiz.roomId);
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]: emit \'endQuestionTimeServer\' event.`);
        gameSocket.emit('endQuestionTimeServer');
        QuizService.endQuestion(quiz);
    } else {
        console.log(`BasicQuizGame[roomId:${quiz.roomId}]#endQuestion: question is already finished.`);
    }
}

function startQuestionTimer(quiz) {
    //quiz.questionTimer = QUESTION_TIME;
    const time = QUESTION_TIME * 1000;
    setTimeout(() => {
        endQuestion(quiz);
    }, time);

    let interval = setInterval(()=>{
        const gameSocket = RoomService.getGameSocketFromRoom(quiz.roomId);
        if(gameSocket !== undefined) {
            clearInterval(interval);
            gameSocket.once('endQuestionTimeFE', () => {
                console.log(`BasicQuizGame[roomId:${quiz.roomId}]: handle \'endQuestionTimeFE\' event.`);
                try {
                    QuizService.endQuestion(quiz);
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
                answerId = 0;
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
        QuizService.endQuestion(quiz);
    }
}

function endGame(quiz) {
    const playersOrder = QuizService.collectResults(quiz);
    RoomService.setPlayersOrderFromMiniGame([...playersOrder], quiz.roomId);
    gamesMap.delete(quiz.roomId);
}