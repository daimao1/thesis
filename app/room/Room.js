const saveRoom = require('./RoomDao.js').saveRoom;

class Room {

    constructor(roomName, adminId){
        //Fields must have the same names as fields in database
        this.id = undefined;
        this.name = roomName;
        this.administrator_id = adminId;
        //this.game_number = Room.generateGameNumber();

        this.saveToDatabaseAndSetIdFromDatabase();

        console.log(`New room: ${this.name}, id: loading from db, administrator_id: ${this.administrator_id}`);
    }

    saveToDatabaseAndSetIdFromDatabase(){
        //TODO dodać game_number
        let promise = saveRoom(this.name, this.administrator_id);
        promise.then((insertedId) => {
            this.id = insertedId;
            console.log("ID from database saved as Room property. room.id: [" + this.id + "]");

            //this.createSocketNamespace(this.id);
        });
    }

   // createSocketNamespace(id) { }

    // static generateGameNumber(){
    //     //TODO logika generowania
    //     //można też całkiem to olać i korzystać z id
    //     return '1231';
    // }
}

module.exports = Room;




