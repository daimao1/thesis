class Player {

    constructor(id, deviceId, roomId, inRoomId, socket) {
        /**
         * Fields must have the same names as fields in database
         */
        this.id = id;
        this.device_id = deviceId;
        this.room_id = roomId;
        this.inRoomId = inRoomId;
        this.socket = socket;
        //fieldNumber
    }

    setName(name) {
        if (this.name !== undefined) {
            throw new Error(`Player[${this.id}]#setName(): this player already have a name.`);
        }
        this.name = name;
    }
}

module.exports = Player;