class Player {

    constructor(roomId, socket, name) {
        /**
         * Fields must have the same names as fields in database
         */
        this.id = undefined;
        //this.device_id = deviceId;
        this.room_id = roomId;
        this.socket = socket;
        this.name = name;
        this.in_room_id = undefined;
        this.field_number = 0;
        this.extraDices = undefined; //this player get extra dices - 1 or 2
    }

    setId(id) {
        if(id === undefined) {
            throw new Error(`Player#setId(): id undefined.`);
        }
        if(this.id !== undefined) {
            throw new Error(`Player#setId(): this player already have id.`);
        }
        this.id = id;
    }

    // setName(name) {
    //     if (this.name !== undefined) {
    //         throw new Error(`Player[${this.id}]#setName(): this player already have a name.`);
    //     }
    //     this.name = name;
    // }
}

module.exports = Player;