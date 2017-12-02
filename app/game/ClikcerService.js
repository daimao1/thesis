'use strict';
const RoomService = require('../room/RoomService');

exports.initClicker = initClicker;

function initClicker(socketNamespace) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    let results = new Array(players.length);
    let isAllPlayersAnswered = false;
    players.forEach((player) => {
        player.socket.emit('launchClicker');

        player.socket.once('clickerResult', (result) => {
            results[player.in_room_id] = result;
            isAllPlayersAnswered = checkIsAllPlayersSentResults(socketNamespace, results);
        });
    });
    handleClickerTimerEvents(socketNamespace);

    //after handle stopClickerTime event from game check did all players send theirs results
    //if not, check every second
    //after 10 sec collect results anyway
    socketNamespace.gameSocket.once('stopClickerTimer', () => {
        let intervalCounter = 0;
        let interval = setInterval( () => {
            if(isAllPlayersAnswered){
                clearInterval(interval);
            } else {
                if(intervalCounter++ > 10){
                   clearInterval(interval);
                   results = fillEmptyResults(results)
                   collectResults(socketNamespace, results);
                }
            }
        }, 1000);
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

function handleClickerTimerEvents(socketNamespace) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    socketNamespace.gameSocket.once('startClickerTimer', () => {
        players.forEach((player) => {
            player.socket.emit('startClickerTimer');
        });
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
    if(results.length === playersDTOs.length){

    }
}
//
// function collectResults(quiz) {
//     let playerScores = [];
//     if(quiz.playerScores === undefined){
//         throw new Error('QuizService#collectResults: playerScores undefined.');
//     }
//     for (let i = 0; i < quiz.playerScores.size; i++) {
//         playerScores[i] = quiz.playerScores.get(i);
//     }
//     const sortedPlayerScores = playerScores.slice();
//     sortedPlayerScores.sort(compareNumbers).reverse();
//
//     let playersOrder = [];
//
//     for (let i = 0; i < quiz.playerScores.size; i++) {
//         let index = playerScores.indexOf(sortedPlayerScores[i]);
//         playerScores[index] = -1;
//         playersOrder[i] = index;
//     }
//     if(playersOrder.length !== RoomService.getPlayersDTOs(quiz.roomId).length){
//         throw new Error(`QuizService[roomId:${quiz.roomId}]#ecollectResults: unexpected playersOrder.`);
//     }
//     quiz.playersOrder = playersOrder;
//     return playersOrder;
// }