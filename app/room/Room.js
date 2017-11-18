'use strict';
const Constants = require('../Constants');

class Room {

    constructor(id, name, adminId, socketNamespace) {
        /**
         * Fields must have the same names as fields in database
         */
        this.id = id;
        this.name = name;
        this.administrator_id = adminId;
        this.socketNamespace = socketNamespace;
        this.players = [];
        this.numberOfPlayers = undefined;
        this.playersOrder = [];
        this.currentPlayerId = -1;
        this.isGameStarted = false;
        //this.game_number = Room.generateGameNumber();

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
        if (this.players.length >= Room.MAX_PLAYERS) {
            throw new Error(`Room[${this.id}]#addPlayer(): room full, cannot add new player.`);
        }
        player.in_room_id = this.players.length;
        this.players.push(player);
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

    // static generateGameNumber(){
    //     //TODO logika generowania
    //     //można też całkiem to olać i korzystać z id
    //     return '1231';
    // }
}

module.exports = Room;