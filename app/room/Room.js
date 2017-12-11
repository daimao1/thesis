'use strict';
const Constants = require('../utils/Constants');

class Room {

    /**
     *
     * @param id
     * @param name
     * @param adminId
     * @param {object=} socketNamespace
     * @param {number=} numberOfPlayers
     * @param {number=} isGameStarted
     */
    constructor(id, name, adminId, socketNamespace, numberOfPlayers, isGameStarted) {
        /**
         * Fields must have the same names as fields in database
         */
        this.id = id;
        this.name = name;
        this.administrator_id = adminId;
        this.socketNamespace = socketNamespace;
        this.players = [];
        this.numberOfPlayers = numberOfPlayers;
        this.playersOrder = [];
        this.currentPlayerId = -1;
        this.isGameStarted = !!(isGameStarted || isGameStarted === 1);
        this.turnInProgress = false;
        this.allPlayersConnected = false;

        if (socketNamespace === undefined) {
            console.log(`Room[${this.id}]#constructor(): new room: [${this.name}], administrator_id: [${this.administrator_id}], socketNamespace: undefined yet.`);
        } else {
            console.log(`Room[${this.id}]#constructor(): new room: [${this.name}], administrator_id: [${this.administrator_id}], socketNamespace.roomId: [${this.socketNamespace.roomId}]`);
        }
    }

    static get MAX_PLAYERS() {
        return Constants.MAX_PLAYERS;
    }

    addPlayer(player) {
        if (this.players !== undefined && this.players.length >= Room.MAX_PLAYERS) {
            throw new Error(`Room[${this.id}]#addPlayer(): room full, cannot add new player.`);
        }
        if(player.in_room_id === undefined){
            if(this.players === undefined){
                player.in_room_id = 0;
                this.players = [];
            } else {
                player.in_room_id = this.players.length;
            }
            this.players.push(player);
        } else if(this.players.length === 0 && this.numberOfPlayers !== undefined && this.isGameStarted){
            this.players = new Array(this.numberOfPlayers);
            this.players[player.in_room_id] = player;
        } else if(this.numberOfPlayers !== undefined && this.isGameStarted){
            if(this.players[player.in_room_id] !== undefined){
                this.players[player.in_room_id] = player;
            } else {
                throw new Error(`Room[${this.id}]#addPlayer(): player with this 'in_room_id' already exist.`);
            }
        }
        console.log(`Room[${this.id}]#addPlayer(): new player added. InRoomId: [${player.in_room_id}]`);
    }

    addSocketNamespace(socketNamespace) {
        if (this.socketNamespace !== undefined) {
            throw new Error(`Room[${this.id}]#addSocketNamespace(): 'socketNamespace' already defined. SocketNamespace.id: [${this.socketNamespace.id}]`);
        }
        this.socketNamespace = socketNamespace;
        console.log(`Room[${this.id}]#addSocketNamespace(): 'socketNamespace' added: [/${this.socketNamespace.roomId}]`);
    }

    removeAllPlayers() {
        this.players = [];
        console.log(`Room[${this.id}]#removePlayers(): all players has been completely removed.`);
    }

    removePlayer(player) {
        const index = this.players.indexOf(player);
        if (index > -1) {
            this.players.splice(index, 1);
            console.log(`Room[${this.id}]#removePlayer(): player{id: ${player.id}, index_in_room: ${index}} removed.`);
        }
        else {
            throw new Error(`Room[${this.id}]#removePlayer(): cannot find player with id[${player.id}] in this room. Removing failed.`);
        }
    }

    setNewPlayersOrder(order) {
        this.playersOrder = order;
        console.log(`Room[${this.id}]#setNewPlayersOrder(): new order.`);
    }

    nextPlayerTurn() {
        const playerId = this.playersOrder.pop();
        if(playerId === undefined) {
          this.currentPlayerId = -1;
        } else {
          this.currentPlayerId = playerId;
        }
        console.log(`Room[${this.id}]#newPlayerTurn(): currentPlayerId = [${this.currentPlayerId}].`);
        return this.currentPlayerId;
    }
}

module.exports = Room;