'use strict';

class Question {

    constructor() {
        /**
         * Fields must have the same names as fields in database
         */
        this.id = undefined;
        this.correct_answer = undefined;
        this.answer2 = undefined;
        this.answer3 = undefined;
        this.answer4 = undefined;
    }
}

module.exports = Question;