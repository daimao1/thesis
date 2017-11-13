let PLAYER_ORDERS = {
    FIRST_TO_LAST: 1,
    FIRST_TO_FIRST: 2
};

/*
* Default player order:
* FIRST_TO_LAST
*
* The winner of mini game will be move as the last one.
*/
const PLAYER_ORDER = PLAYER_ORDERS.FIRST_TO_LAST;

const MAX_PLAYERS = 6;

exports.PLAYER_ORDERS = PLAYER_ORDERS;
exports.PLAYER_ORDER = PLAYER_ORDER;
exports.MAX_PLAYERS = MAX_PLAYERS;