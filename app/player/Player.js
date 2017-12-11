class Player {

    constructor(id, roomId, socket, name, deviceName, fieldNumber) {
        /**
         * Fields must have the same names as fields in database
         */
        this.id = id;
        this.room_id = roomId;
        this.socket = socket;
        this.name = name;
        this.in_room_id = undefined;
        this.field_number = fieldNumber;
        this.extraDices = undefined; //this player get extra dices - 1 or 2
        this.device_name = deviceName;
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