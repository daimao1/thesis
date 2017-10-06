class Room {

    constructor(id, name, adminId, socketNamespace) {
        //Fields must have the same names as fields in database
        this.id = id;
        this.name = name;
        this.administrator_id = adminId;
        this.socketNamespace = socketNamespace;
        this.players = [];
        //this.game_number = Room.generateGameNumber();

        console.log(`New room: [${this.name}], id: [${this.id}], administrator_id: [${this.administrator_id}]`);
    }

    static get MAX_PLAYERS() {
        /**
         * MAX PLAYERS IN ONE ROOM: 6
         */
        return 6;
    }

    addPlayer(player) {
        if (this.players.length >= this.MAX_PLAYERS) {
            throw new Error(`Room#${this.id}: room full, cannot add new player.`);
        }
        this.players.push(player);
        console.log(`Room#${this.id}: new player added.`);
    }

    addSocketNamespace(socketNamespace) {
        if(this.socketNamespace !== undefined) {
            throw new Error(`Room#${this.id}: 'socketNamespace' already defined. SocketNamespace.id: [${this.socketNamespace.id}]`);
        }
        this.socketNamespace = socketNamespace;
        console.log(`Room#${this.id}: 'socketNamespace' added: [/${this.socketNamespace.roomId}]`);
    }

    removePlayers(){
        this.players = [];
        console.log(`Room#${this.id}: all players has been completely removed.`);
    }

    // static generateGameNumber(){
    //     //TODO logika generowania
    //     //można też całkiem to olać i korzystać z id
    //     return '1231';
    // }
}

module.exports = Room;