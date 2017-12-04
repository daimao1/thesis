'use strict';

const Quiz = require('./Quiz');
const QuestionService = require('./question/QuestionService');
const RoomService = require('../room/RoomService');

let quizzes = [];

exports.createQuiz = createQuiz;
exports.getNextQuestion = getNextQuestion;
exports.getQuizById = getQuizById;
exports.collectResults = collectResults;
exports.checkAnswers = checkAnswers;
exports.endQuestion = endQuestion;

function getNextQuestion(quiz) {
    if (quiz === undefined || quiz.questions === undefined || quiz.questions.length === 0) {
        //no more questions in quiz or error
        return undefined;
    }
    //return current question
    if (quiz.currentQuestion !== undefined) {
        return quiz.currentQuestion;
    }
    //return next question
    quiz.currentQuestionWinners = [];
    const question = quiz.questions.pop();
    quiz.currentQuestion = question;
    return question;
}

function getQuizById(id) {
    let quiz;
    for (let i = 0; i < quizzes.length; i++) {
        if (quizzes[i].id === id) {
            quiz = quizzes[i];
            break;
        }
    }
    if (quiz === undefined) {
        throw new Error(`QuizService#getQuizById: cannot find quiz with id[${id}].`);
    }
    return quiz;
}

function createQuiz(questionsQuantity, roomId) {

    let quiz = new Quiz(quizzes.length, roomId);

    for (let i = 0; i < questionsQuantity; i++) {
        let question = QuestionService.getNextQuestion();
        quiz.addQuestion(question);
    }

    const players = RoomService.getPlayersDTOs(roomId);
    players.forEach((player) => {
        quiz.playerScores.set(player.id, 0);
    });

    quizzes.push(quiz);

    if (quizzes.indexOf(quiz) !== quiz.id) {
        throw new Error('QuizService#createQuiz: unexpected state: array index is different to quiz.id. ' +
            `{quizes index: [${quizzes.indexOf(quiz)}], quiz.id: [${quiz.id}]}`);
    }
    return quiz;
}

function checkAnswers(quiz) {
    if(quiz.currentQuestion === undefined){
        throw new Error(`QuizService[roomId:${quiz.roomId}]#endQuestion: question is already finished.`);
    }
    const playersDTOs = RoomService.getPlayersDTOs(quiz.roomId);
    if(playersDTOs.length !== quiz.playerScores.size){
        throw new Error(`QuizService[roomId:${quiz.roomId}]#endQuestion: incorrect state of quiz playerAnswers or playerScores.`);
    }
    if(playersDTOs.length !== quiz.playerAnswers.size){
        playersDTOs.forEach((player)=>{
           if(!quiz.playerAnswers.has(player.id)){
               quiz.playerAnswers.set(player.id, -1);
           }
        });
    }
    quiz.playerAnswers.forEach((answerId, playerId) => {
        if (answerId !== -1 && quiz.currentQuestion.answers[answerId] === quiz.currentQuestion.correct_answer) {
            quiz.playerScores.set(playerId, quiz.playerScores.get(playerId) + 1);
            const player = RoomService.getPlayerFromRoom(quiz.roomId, playerId);
            quiz.currentQuestionWinners.push(player.name);
        }
    });
}

function collectResults(quiz) {
    let playerScores = [];
    if(quiz.playerScores === undefined){
        throw new Error('QuizService#collectResults: playerScores undefined.');
    }
    for (let i = 0; i < quiz.playerScores.size; i++) {
        playerScores[i] = quiz.playerScores.get(i);
    }
    const sortedPlayerScores = playerScores.slice();
    sortedPlayerScores.sort(compareNumbers).reverse();
    quiz.sortedResults = sortedPlayerScores;

    let playersOrder = [];

    for (let i = 0; i < quiz.playerScores.size; i++) {
        let index = playerScores.indexOf(sortedPlayerScores[i]);
        playerScores[index] = -1;
        playersOrder[i] = index;
    }
    if(playersOrder.length !== RoomService.getPlayersDTOs(quiz.roomId).length){
        throw new Error(`QuizService[roomId:${quiz.roomId}]#ecollectResults: unexpected playersOrder.`);
    }
    quiz.playersOrder = playersOrder;
    return playersOrder;
}

function endQuestion(quiz) {
    if(quiz.currentQuestion === undefined){
        throw new Error(`QuizService[roomId:${quiz.roomId}]#endQuestion: this question has been finished earlier.`);
    }
    quiz.currentQuestion = undefined;
}

function compareNumbers(a, b) {
    return a - b;
}