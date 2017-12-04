let PLAYER_ORDERS_OPTIONS = {
    FIRST_TO_LAST: 1,
    FIRST_TO_FIRST: 2
};

/*
* Default player order:
* FIRST_TO_LAST
*
* The winner of mini game will be move as the last one.
*/
const PLAYER_ORDER = PLAYER_ORDERS_OPTIONS.FIRST_TO_LAST;

const MAX_PLAYERS = 6;

const SPECIAL_GRIDS = {
    CASTLE: 'castle',
    STADIUM: 'stadium',
    CHALLENGE4: 'challenge4',
    CHALLENGE5: 'challenge5',
    CHALLENGE6: 'challenge6',
    TOWN_HALL: 'townHall',
    ONE_VS_ALL: 'oneVsAll'
};

const MINI_GAMES = {
    STOP_TIME: 'stopTime',
    BASIC_QUIZ: 'basicQuiz',
    CLICKER: 'clicker'
};

const GAMES_URLS = {
    STOP_TIME: "stoptimegame",
    BASIC_QUIZ: "quiz",
    CLICKER: "clicker",
    BOARD: "board"
};

/**
 * Time for answering for a question in seconds
 * */
const QUESTION_TIME = 20;

exports.PLAYER_ORDERS_OPTIONS = PLAYER_ORDERS_OPTIONS;
exports.PLAYER_ORDER = PLAYER_ORDER;
exports.MAX_PLAYERS = MAX_PLAYERS;
exports.SPECIAL_GRIDS = SPECIAL_GRIDS;
exports.MINI_GAMES = MINI_GAMES;
exports.QUESTION_TIME = QUESTION_TIME;
exports.GAMES_URLS = GAMES_URLS;