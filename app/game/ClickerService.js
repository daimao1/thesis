'use strict';
const RoomService = require('../room/RoomService');

exports.initClicker = function (socketNamespace) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    let results = new Array(players.length);
    const timeout = generateClickerTimeout(socketNamespace.gameSocket);

    let isAllPlayersAnswered = false;
    players.forEach((player) => {
        player.socket.emit('launchClicker');

        player.socket.once('clickerResult', (result) => {
            results[player.in_room_id] = result;
            isAllPlayersAnswered = checkIsAllPlayersSentResults(socketNamespace, results);
        });
    });
    startClickerTimerEvents(socketNamespace, timeout);

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
                   results = fillEmptyResults(results);
                   collectResults(socketNamespace, results);
                }
            }
        }, 1000);
    });
};

function checkIsAllPlayersSentResults(socketNamespace, results){
    if(results.contains(undefined)){
        return false;
    } else {
        collectResults(socketNamespace, results);
        return true;
    }
}

function startClickerTimerEvents(socketNamespace, time) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    socketNamespace.gameSocket.once('startClickerTimer', () => {
        players.forEach((player) => {
            player.socket.emit('startClickerTimer', time);
        });
    });
}

function generateClickerTimeout(gameSocket){
    let timeout = Math.floor(Math.random() * 6) + 5;
    gameSocket.emit('clickerTimeout', timeout);
    return timeout;
}

function fillEmptyResults(results){
    for(let i=0; i< results.length; i++){
        if(results[i] === undefined){
            results[i] = 0;
        }
    }
    return results;
}

function sendResultsToGame(sortedResults, playersOrder, playersDTOs, socketNamespace){
    let playerNamesInOrder = new Array(playersOrder.length);
    for(let i=0; i<playersOrder.length; i++){
        playerNamesInOrder[i] = playersDTOs[playersOrder[i]].name;
    }
    socketNamespace.gameSocket.emit('clickerResults', playerNamesInOrder, sortedResults);
}

function collectResults(socketNamespace, results) {
    const playersDTOs = RoomService.getPlayersDTOs(socketNamespace.roomId);
    if(results.length !== playersDTOs.length){
        throw new Error(`ClickerService[roomId:${socketNamespace.roomId}]#collectResults: unexpected size of results array.`);
    }
    console.log('Results:');
    console.log(typeof results);
    console.log(results);
    const sortedResults = results.slice();
    sortedResults.sort(compareNumbers).reverse();
    console.log(results);

    let playersOrder = [];

    for (let i = 0; i <sortedResults.length; i++) {
        let index = results.indexOf(sortedResults[i]);
        results[index] = undefined;
        playersOrder[i] = index;
    }
    if(playersOrder.length !== playersDTOs.length){
        throw new Error(`ClickerService[roomId:${socketNamespace.roomId}]#collectResults: unexpected size of playerOrder array.`);
    }
    sendResultsToGame(sortedResults, playersOrder, playersDTOs, socketNamespace);
    RoomService.setPlayersOrderFromMiniGame(playersOrder);
    return playersOrder;
}

function compareNumbers(a, b) {
    return a - b;
}