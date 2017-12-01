'use strict';

class Quiz {

    constructor(id, roomId) {
        this.id = id;
        this.roomId = roomId;
        this.questions = [];
        this.playerScores = new Map();
        this.playerAnswers = new Map();
        this.currentQuestion = undefined;
        //this.playersOrder = undefined;
        this.currentQuestionWinners = [];
        //this.questionTimer = 0;
    }

    addQuestion(question){
        this.questions.push(question);
    }
}

module.exports = Quiz;