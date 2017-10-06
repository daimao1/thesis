
class Player{

    constructor(id, name, deviceId, roomId, socket){
        this.id = id;
        this.name = name;
        this.deviceId = deviceId;
        this.socket = socket;
        this.roomId = roomId;
        //fieldNumber, roomId?
    }
}
module.exports = Player;