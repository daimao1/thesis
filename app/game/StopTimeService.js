'use strict';
const RoomService = require('../room/RoomService');

exports.initGame = initGame;

function initGame(socketNamespace) {
    const playersDTOs = RoomService.getPlayersDTOs(socketNamespace.roomId);
    socketNamespace.gameSocket.emit('playersInfo', playersDTOs);
    console.log(`StopTimeService[roomId:${socketNamespace.roomId}]: emitting playerDTOs to game.`);

    const players = RoomService.getAllPlayersFromRoom(socketNamespace.roomId);

    players.forEach((player) => {
        player.socket.emit('stopTimeGame');
    });
    console.log(`StopTimeService[roomId:${socketNamespace.roomId}]: notify players about stop-time-game.`);

    socketNamespace.gameSocket.once('stopTimeStartTimer', () => {

        console.log(`StopTimeService[roomId:${socketNamespace.roomId}]: stop-time-game timer start counting.`);
        players.forEach((player) => {
            player.socket.emit('startTimer');
        });
        console.log(`StopTimeService[roomId:${socketNamespace.roomId}]: emit 'startTimer' event to players.`);

        players.forEach((player) => {
            playerStopButton(player, socketNamespace);
        });

        socketNamespace.gameSocket.once('stopTimeResults', (goal, results) => {
            console.log(`StopTimeService[roomId:${socketNamespace.roomId}]: handle 'stopTimeResults' event.`);
            collectResults(socketNamespace, goal, results);
        });
    });
}

function playerStopButton(player, socketNamespace) {
    player.socket.once('stopButton', () => {
        socketNamespace.gameSocket.emit('stopPlayerButton', player.in_room_id);
        console.log(`StopTimeService[roomId:${socketNamespace.roomId}]: player[${player.in_room_id}] press stop button, emitting event to game.`);
    });
}

function collectResults(socketNamespace, goal, results) {

    const numberOfPlayers = getNumberOfPlayers(socketNamespace);
    if (results.length !== numberOfPlayers) {
        throw new Error(`StopTimeService[roomId:${socketNamespace.roomId}]#collectResults: unexpected size of results array.`);
    }

    let playersResults = [];

    for (let i = 0; i < results.length; i++) {
        const diff = goal - results[i];
        playersResults[i] = Math.abs(diff);
    }
    console.error(`StopTimeService[roomId:${socketNamespace.roomId}]#collectResults: playerResults:`);
    console.error(playersResults);

    let sortedResults = playersResults.slice();
    sortedResults.sort(compareNumbers);
    console.error(`StopTimeService[roomId:${socketNamespace.roomId}]#collectResults: sortedResults:`);
    console.error(sortedResults);


    let playersOrder = [];
    for (let i = 0; i < results.length; i++) {
        let index = playersResults.indexOf(sortedResults[i]);
        playersResults[index] = undefined;
        playersOrder[i] = index;
    }
    if (playersOrder.length !== numberOfPlayers) {
        throw new Error(`StopTimeService[roomId:${socketNamespace.roomId}]#collectResults: unexpected size of playersOrder.`);
    }
    RoomService.setPlayersOrder(playersOrder, socketNamespace.roomId);
    RoomService.setExtraDices(socketNamespace.roomId, playersOrder, sortedResults);
    return playersOrder;
}

function compareNumbers(a, b) {
    return a - b;
}

function getNumberOfPlayers(socketNamespace) {
    const playersDTOs = RoomService.getPlayersDTOs(socketNamespace.roomId);
    return playersDTOs.length;
}