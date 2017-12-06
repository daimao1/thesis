'use strict';

class Question {

    constructor(id, content, correct_answer, answer2, answer3, answer4) {
        /**
         * Fields must have the same names as fields in database
         */
        this.id = id;
        this.content = content;
        this.correct_answer = correct_answer;
        this.answer2 = answer2;
        this.answer3 = answer3;
        this.answer4 = answer4;
        this.answers = [this.correct_answer, this.answer2, this.answer3, this.answer4];
    }
}

module.exports = Question;