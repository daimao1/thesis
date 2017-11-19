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
    STOP_TIME: 'stopTime'
};

exports.PLAYER_ORDERS_OPTIONS = PLAYER_ORDERS_OPTIONS;
exports.PLAYER_ORDER = PLAYER_ORDER;
exports.MAX_PLAYERS = MAX_PLAYERS;
exports.SPECIAL_GRIDS = SPECIAL_GRIDS;
exports.MINI_GAMES = MINI_GAMES;