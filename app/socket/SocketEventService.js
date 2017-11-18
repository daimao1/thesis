'use strict';
const RoomService = require('../room/RoomService');
const PlayerService = require('../player/PlayerService');
const Constants = require('../Constants');
const MiniGames = require('../game/MiniGameService');

exports.initBasicHandlers = initBasicHandlers;
exports.sendPlayersInfoToGame = sendPlayersInfoToGame;

function initBasicHandlers(socket, socketNamespace) {
    socket.on('playerName', (playerName) => {
        newPlayer(socket, socketNamespace, playerName);
    });

    socket.on('markGame', () => {
        if(RoomService.isGameStarted(socketNamespace.roomId)) {
            console.log(`SocketEventService: room[${socketNamespace.roomId}] game (board) resumed.`);
        } else {
            RoomService.markGameAsStarted(socketNamespace.roomId);
            console.log('SocketEventService: new game board started.');
        }
        socketNamespace.gameSocket = socket;
        addGameDisconnectHandler(socketNamespace);
        addGameDefaultHandlers(socketNamespace);
        sendPlayersInfoToGame(socketNamespace);
    });

    socket.on('markStopTimeGame', ()=> {
        socketNamespace.gameSocket = socket;
        MiniGames.startMiniGame(Constants.MINI_GAMES.STOP_TIME, socketNamespace);
    });
}

function newPlayer(socket, socketNamespace, name) {
    socket.join('players');
    console.log('SocketEventHandler: handle \'playerName\' event - creating new player.');
    const player = PlayerService.newPlayer(socketNamespace.roomId, socket, name);
    addPlayerDisconnectHandler(player);
    addPlayerDefaultHandlers(player, socketNamespace);
}

function addPlayerDisconnectHandler(player) {
    player.socket.on('disconnect', () => {
        console.log(`SocketIO/N/EventHandler: player disconnected. RoomID: [${player.room_id}], inRoomId: [${player.in_room_id}]`);
        RoomService.removePlayer(player);
        PlayerService.removeFromDb(player);
    });
}

function addGameDisconnectHandler(socketNamespace) {
    socketNamespace.gameSocket.on('disconnect', () => {
        console.log(`SocketEventService: room[${socketNamespace.roomId}] game disconnect.`);
        //throw new Error('Game socket disconnected! Not implemented!');
    });
}

function sendPlayersInfoToGame(socketNamespace) {
    if (socketNamespace === undefined) {
        throw new Error('SocketEventService#sendRoomInfoToGame(): socketNamespace undefined.');
    }
    socketNamespace.gameSocket.emit('playersInfo', RoomService.getPlayersDTOs(socketNamespace.roomId));
}

function addPlayerDefaultHandlers(player, socketNamespace) {

    //TODO after jump to StopTimeGame
    player.socket.on('stopButton', function () {
        socketNamespace.gameSocket.emit('stopTime', player.in_room_id);
    });
    player.socket.on('diceValue', function (value) {
        socketNamespace.gameSocket.emit('playerDice', value);
    });
}

function addGameDefaultHandlers(socketNamespace) {
    socketNamespace.gameSocket.on('specialGrid', function (gridData) {
        const playerToNotify = RoomService.getPlayerFromRoom(socketNamespace.roomId, gridData.playerId);
        playerToNotify.socket.emit('specialGrid', gridData.gridName);
    });

    socketNamespace.gameSocket.on('gameReady', function () {
        let orderFromMiniGame = [];

        try {
            orderFromMiniGame = startMiniGame(socketNamespace);
            RoomService.setPlayersOrderFromMiniGame([...orderFromMiniGame], socketNamespace.roomId);
        } catch(error) {
            console.error(error);
        }
        let playerTurnId = RoomService.nextPlayerTurn(socketNamespace.roomId);
        socketNamespace.gameSocket.emit('nextPlayerTurn', playerTurnId);

        socketNamespace.gameSocket.on('endPlayerTurn', (playerToSaveId, field) => {
            RoomService.endTurn(socketNamespace.roomId);

            RoomService.saveGameState(playerToSaveId, field, socketNamespace.roomId);

            let playerId = RoomService.nextPlayerTurn(socketNamespace.roomId);
            //if it was last player - start new round
            if (playerId === -1) {
                RoomService.endTurn(socketNamespace.roomId);
                RoomService.endRound(socketNamespace.roomId);
                orderFromMiniGame = startMiniGame(socketNamespace);
                RoomService.setPlayersOrderFromMiniGame([...orderFromMiniGame], socketNamespace.roomId);
                playerId = RoomService.nextPlayerTurn(socketNamespace.roomId);
            }

            if (playerId > -1 && playerId < Constants.MAX_PLAYERS) {
                socketNamespace.gameSocket.emit('nextPlayerTurn', playerId);
            }
        });

        //Next you have to wait for diceValue event from player.
        //When this player send a event to you, then you have to send playerDice event to the game.
        //If think that i have to wait for signal from game that this player end his move?
        //Exactly, and init move of the next player. If this was last player, then you have to end this round, and init next minigame.
    });
}

function startMiniGame(socketNamespace) {
    console.log(`SocketEventService#startMiniGame(): start mini-game in room[${socketNamespace.roomId}]...`);

    const playersOrder = [];
    const playersDTOs = RoomService.getPlayersDTOs(socketNamespace.roomId);
    for (let i = 0, len = playersDTOs.length; i < len; i++) {
        playersOrder.push(i);
    }

    return playersOrder;
}