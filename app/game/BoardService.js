'use strict';
const RoomService = require('../room/RoomService');
const Redirector = require('../utils/Redirector');
const Constants = require('../utils/Constants');
const MiniGameService = require('./MiniGameService');

exports.onPlayerDiceValue = onPlayerDiceValue;
exports.initGame = initGame;

function initGame(socketNamespace) {

    const order = MiniGameService.createDefaultOrder(socketNamespace.roomId);
    RoomService.setPlayersOrder([...order], socketNamespace.roomId);

    socketNamespace.gameSocket.on('gameReady', function () {
        if(Constants.MINI_GAME_ON_START){
            try {
                Redirector.redirectToMiniGame(socketNamespace);
            } catch (error) {
                console.error(error);
            }
        } else {
            nextPlayerTurn(socketNamespace);
        }

        socketNamespace.gameSocket.on('endPlayerTurn', (playerToSaveId, field) => {
            RoomService.endTurn(socketNamespace.roomId);
            RoomService.saveGameState(playerToSaveId, field, socketNamespace.roomId);

            nextPlayerTurn(socketNamespace);
        });
    });
    specialGridHandler(socketNamespace);
    sendPlayersInfoToGame(socketNamespace);
}

function nextPlayerTurn(socketNamespace) {
    let player = RoomService.nextPlayerTurn(socketNamespace.roomId);
    if (player === undefined) {
        RoomService.endRound(socketNamespace.roomId);
        socketNamespace.gameSocket.emit('endRound');
        //TODO minigame type
        Redirector.redirectToMiniGame(socketNamespace);
        return;
        //MiniGameService.startMiniGame('default', socketNamespace);
        //player = RoomService.nextPlayerTurn(socketNamespace.roomId);
    }
    if (player.in_room_id > -1 && player.in_room_id < Constants.MAX_PLAYERS) {
        socketNamespace.gameSocket.emit('nextPlayerTurn', player.in_room_id);
        socketNamespace.namespace.to('players').emit('playerTurn', {playerName: player.name});
    } else {
        throw new Error('SocketEventService#nextPlayerTurn: player undefined.');
    }

    if (player.extraDices === 2) {
        socketNamespace.namespace.to(player.socket.id).emit('threeDices');
    } else if (player.extraDices === 1) {
        socketNamespace.namespace.to(player.socket.id).emit('twoDices');
    } else {
        socketNamespace.namespace.to(player.socket.id).emit('dice');
    }
}

function challenge(challengeType, socketNamespace, playerId) {
    const player = RoomService.getPlayerFromRoom(socketNamespace.roomId, playerId);
    player.socket.emit('challengeDice');
    player.socket.once('challengeDiceValue', (value) => {
        if (value >= challengeType) {
            socketNamespace.gameSocket.emit('challengeResult', true, player.in_room_id);
        } else {
            socketNamespace.gameSocket.emit('challengeResult', false, player.in_room_id);
        }
    });
}

function specialGridHandler(socketNamespace){
    if(socketNamespace === undefined){
        throw new Error(`BoarService#specialGridHandler: socketNamespace undefined.`);
    }
    socketNamespace.gameSocket.on('specialGrid', function (gridData) {
        if (gridData.gridName === Constants.SPECIAL_GRIDS.CHALLENGE4) {
            challenge(4, socketNamespace, gridData.playerId);
        } else if (gridData.gridName === Constants.SPECIAL_GRIDS.CHALLENGE5) {
            challenge(5, socketNamespace, gridData.playerId);
        } else if (gridData.gridName === Constants.SPECIAL_GRIDS.CHALLENGE6) {
            challenge(6, socketNamespace, gridData.playerId);
        }
    });
}

function onPlayerDiceValue(player, socketNamespace) {
    player.socket.on('diceValue', function (value) {
        const currentPlayerId = RoomService.getCurrentPlayerId(socketNamespace.roomId);
        if (currentPlayerId === player.in_room_id) {
            socketNamespace.gameSocket.emit('playerDice', value);
        }
    });
}

function sendPlayersInfoToGame(socketNamespace) {
    if (socketNamespace === undefined) {
        throw new Error('SocketEventService#sendRoomInfoToGame(): socketNamespace undefined.');
    }
    socketNamespace.gameSocket.emit('playersInfo', RoomService.getPlayersDTOs(socketNamespace.roomId));
}