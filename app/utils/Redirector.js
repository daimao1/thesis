'use strict';
const Constants = require('./Constants');
const RoomService = require('../room/RoomService');

exports.redirectToMiniGame = function (socketNamespace, miniGameType) {
    const url = createUrl(socketNamespace.roomId, miniGameType);
    if(socketNamespace.gameSocket === undefined){
        throw new Error(`Redirector#redirectToBoard: gameSocket undefined.`);
    }
    sendRedirectEvent(socketNamespace.gameSocket, url);
};

exports.redirectToBoard = function (socketNamespace) {
    const url = createUrl(socketNamespace.roomId);
    if(socketNamespace.gameSocket === undefined){
        throw new Error(`Redirector#redirectToBoard: gameSocket undefined.`);
    }
    sendRedirectEvent(socketNamespace.gameSocket, url);
};

function createUrl(roomId, miniGameType) {
    if (!RoomService.isRoomExist(roomId)) {
        throw new Error(`Redirector#createUrl: room with id [${roomId}] does not exist.`);
    }
    let miniGameUrl = "";
    switch (miniGameType) {
        case Constants.MINI_GAMES.CLICKER:
            miniGameUrl = Constants.GAMES_URLS.CLICKER;
            break;
        case Constants.MINI_GAMES.BASIC_QUIZ:
            miniGameUrl = Constants.GAMES_URLS.BASIC_QUIZ;
            break;
        case Constants.MINI_GAMES.STOP_TIME:
            miniGameUrl = Constants.GAMES_URLS.STOP_TIME;
            break;
        default:
            miniGameUrl = Constants.GAMES_URLS.BOARD;
    }
    return "/" + miniGameUrl + "/" + roomId;
}

function sendRedirectEvent(socket, url) {
    socket.emit('redirect', url);
    socket.once('redirectRejected', onRedirectRejected);
    setTimeout(() => {
        socket.removeListener('redirectRejected', onRedirectRejected);
    }, 20 * 1000);
}

function onRedirectRejected(reason) {
    throw new Error(`Redirector#onRedirectRejected. Reason: ${reason}.`);
}