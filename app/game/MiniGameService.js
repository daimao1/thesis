'use strict';
const Constants = require('../Constants');
const RoomService = require('../room/RoomService');

exports.startMiniGame = function (miniGame, socketNamespace) {

    switch(miniGame){
        case Constants.MINI_GAMES.STOP_TIME:
            stopTime(socketNamespace);
            break;
    }
};

function stopTime(socketNamespace) {

    const playersDTOs = RoomService.getPlayersDTOs(socketNamespace.roomId);
    socketNamespace.gameSocket.emit('playersInfo', playersDTOs);
    socketNamespace.gameSocket.on('stopTimeGameReady', function () {
        console.log('MiniGameService#stopTime(): stop-time-game ready ');
    });
}

