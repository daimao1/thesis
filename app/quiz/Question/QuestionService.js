'use strict';

let questions = [];

function prepareAndGetQuestionById(questionId) {
    let question;
    for(let i = 0; i < questions.length; i++){
        if(questions[i].id === questionId){
            question = questions[i];
            break;
        }
    }
    if(question === undefined){
        throw new Error(`QuestionService#prepareAndGetQuestionById: cannot find question with id[${questionId}].`);
    }

    //TODO hash answers order?
    return question;
}