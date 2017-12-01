'use strict';

const Quiz = require('./Quiz');
const QuestionService = require('./question/QuestionService');
const RoomService = require('../room/RoomService');

let quizzes = [];

exports.createQuiz = createQuiz;
exports.getNextQuestion = getNextQuestion;
exports.getQuizById = getQuizById;

function getNextQuestion(quizId, quiz){
    if(quiz === undefined){
        for(let i=0; i<quizzes.length; i++){
            if(quizzes[i].id === quizId){
                quiz = quizzes[i];
                break;
            }
        }
    }
    if(quiz === undefined || quiz.questions === undefined || quiz.questions.length === 0){
        return undefined;
    } else {
        const question = quiz.questions.pop();
        quiz.currentQuestion = question;
        return question;
    }
}

function getQuizById(id){
    let quiz;
    for(let i = 0; i<quizzes.length; i++){
        if(quizzes[i].id === id){
            quiz = quizzes[i];
            break;
        }
    }
    if(quiz === undefined){
        throw new Error(`QuizService#getQuizById: cannot find quiz with id[${id}].`);
    }
    return quiz;
}

function createQuiz(questionsQuantity, roomId){

    let quiz = new Quiz(quizzes.length, roomId);

    for(let i = 0; i < questionsQuantity; i++){
        let question = QuestionService.getNextQuestion();
        quiz.addQuestion(question);
    }

    const players = RoomService.getPlayersDTOs(roomId);
    players.forEach((player)=> {
        quiz.playerScores.set(player.in_room_id, 0);
    });

    quizzes.push(quiz);

    if(quizzes.indexOf(quiz) !== quiz.id){
        throw new Error('QuizService#createQuiz: unexpected state: array index is different to quiz.id. ' +
         `{quizes index: [${quizzes.indexOf(quiz)}], quiz.id: [${quiz.id}]}`);
    }
    return quiz;
}