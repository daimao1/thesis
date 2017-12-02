'use strict';
const RoomService = require('../room/RoomService');

exports.initClicker = initClicker;


function initClicker(socketNamespace) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    let results = new Array(players.length);
    let isAllPlayersAnswered = false;
    players.forEach((player) => {
        player.socket.emit('launchClicker');

        player.socket.on('clickerResult', (result) => {
            results[player.in_room_id] = result;
            isAllPlayersAnswered = checkIsAllPlayersSentResults(socketNamespace, results);
        });
    });
}

function checkIsAllPlayersSentResults(socketNamespace, results){
    if(results.contains(undefined)){
        return false;
    } else {
        collectResults(socketNamespace, results)
        return true;
    }
}

function startClickerTimer(socketNamespace) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    players.forEach((player) => {
        player.socket.emit('startClickerTimer');
    });
}

function stopClickerTimer(socketNamespace) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    players.forEach((player) => {
        player.socket.emit('stopClickerTimer');
    });
}

function fillEmptyResults(results){
    for(let i=0; i< results.length; i++){
        if(results[i] === undefined){
            results = 0;
        }
    }
    return results;
}


function collectResults(socketNamespace, results) {

    const playersDTOs = RoomService.getPlayersDTOs(socketNamespace.roomId);

    if(results.length === playersDTOs.length)
}
