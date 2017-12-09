'use strict';
const Question = require('./Question');
const QuestionDao = require('./QuestionDao');

let questions = [];
let lastQuestionPointer = -1;

loadQuestionsFromDb();

exports.getNextQuestion = getNextQuestion;
exports.mixAnswers = mixAnswers;
//exports.addNewQuestion = addNewQuestion;

function loadQuestionsFromDb() {
    QuestionDao.getAll().then((rows) => {
        rows.forEach((row) => {
            questions.push(new Question(row.id, row.content, row.correct_answer, row.answer2, row.answer3, row.answer4));
        });
        shuffleArray(questions);
        console.log(`Data loaded from database successfully (Questions table, get [${rows.length}] rows).`);
    }).catch(reject => {
        throw reject;
    });
}

function getNextQuestion() {
    if(questions.length === 0) {
        throw new Error(`QuestionService#getNextQuestion: questions array empty.`);
    }
    if(lastQuestionPointer === questions.length - 1){
        lastQuestionPointer = -1;
        console.log(`QuestionService#getNextQuestion: end of questions array, first question will be delivered.`);
    }
    const question = questions[++lastQuestionPointer];
    mixAnswers(question);
    return question;
}

function mixAnswers(question) {
    shuffleArray(question.answers);
}

// function addNewQuestion(content, correct_answer, answer2, answer3, answer4) {
//     QuestionDao.saveQuestion(content, correct_answer, answer2, answer3, answer4).then((insertedId) => {
//         const question = new Question(insertedId, content, correct_answer, answer2, answer3, answer4);
//         questions.push(question);
//     }).catch(reject => {
//         throw reject;
//     });
// }

// function getFewMoreQuestion(quantity) {
//     if(quantity > questions.length){
//         quantity = questions.length;
//         console.error(`QuestionService#getFewMoreQuestion: cannot deliver [${quantity}] questions.` +
//             `Currently in system are [${questions.length}] questions. All will be delivered.`);
//     }
//     let questionsToReturn = [];
//     for (let i = 0; i < quantity; i++) {
//         questionsToReturn[i] = questions[++lastQuestionPointer];
//     }
//     return questionsToReturn;
// }

// function getQuestionById(questionId) {
//     let question;
//     for (let i = 0; i < questions.length; i++) {
//         if (questions[i].id === questionId) {
//             question = questions[i];
//             break;
//         }
//     }
//     if (question === undefined) {
//         throw new Error(`QuestionService#prepareAndGetQuestionById: cannot find question with id[${questionId}].`);
//     }
//     return question;
// }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}