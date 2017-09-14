const saveRoom = require('./RoomDao.js');

class Room {
    constructor(roomName, administratorId){
        this.name = roomName;
        this.administatorId = administratorId;
        var ref = this;
        saveRoom(roomName, administratorId, function (insertedId) {
            ref.id = insertedId;
            console.log(`New room: ${ref.name},id: ${ref.id}, adminId: ${ref.administatorId}`);
        });

    }

    // get id(){
    //     return this.id;
    // }
    //
    // set id(id){
    //     this.id = id;
    // }
}

module.exports = Room;




