'use strict';
const RoomService = require('../room/RoomService');

exports.initClicker = function (socketNamespace) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    const numberOfPlayers = RoomService.getNumberOfPlayers(socketNamespace.roomId);
    let results = new Array(numberOfPlayers);
    const timeout = generateClickerTimeout(socketNamespace.gameSocket);

    let isAllPlayersAnswered = false;
    players.forEach((player) => {
        player.socket.emit('launchClicker');

        player.socket.once('clickerResult', (result) => {
            result = +result;
            console.log(`ClickerService[roomId:${socketNamespace.roomId}]: receive clicker result from player: [${result}].`);
            if(result < 0){
                throw new Error(`ClickerService[roomId:${socketNamespace.roomId}]#initClicker: received unexpected result.`);
            }
            results[player.in_room_id] = +result;
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
                collectResults(socketNamespace, results);
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
    return !results.includes(undefined);
}

function startClickerTimerEvents(socketNamespace, time) {
    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);
    socketNamespace.gameSocket.once('startClickerTimer', () => {
        players.forEach((player) => {
            let timeObject = {
                time: time
            };
            player.socket.emit('startClickerTimer', timeObject);
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
    const numberOfPlayers = RoomService.getNumberOfPlayers(socketNamespace.roomId);
    if(results.length !== playersDTOs.length || results.length !== numberOfPlayers){
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
    if(playersOrder.length !== numberOfPlayers){
        throw new Error(`ClickerService[roomId:${socketNamespace.roomId}]#collectResults: unexpected size of playerOrder array.`);
    }
    sendResultsToGame(sortedResults, playersOrder, playersDTOs, socketNamespace);
    RoomService.setPlayersOrderFromMiniGame(playersOrder, socketNamespace.roomId);
    return playersOrder;
}

function compareNumbers(a, b) {
    return a - b;
}