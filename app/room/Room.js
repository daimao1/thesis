const saveRoom = require('./RoomDao.js').saveRoom;

class Room {

    constructor(roomName, adminId){
        //Fields must have the same names like fields in database
        this.name = roomName;
        this.adminId = adminId;
        this.gameNumber = Room.generateGameNumber();
        this.databaseId = undefined;

        this.saveToDatabaseAndSetDatabaseId();

        console.log(`New room: ${this.name}, id: loading from db, adminId: ${this.adminId}`);
    }

    saveToDatabaseAndSetDatabaseId(){
        let promise = saveRoom(this.name, this.adminId);
        promise.then((insertedId) => {
            this.databaseId = insertedId;
            console.log("DatabaseId saved as Room property. [databaseId: " + this.databaseId + "]");
        });
    }

    static generateGameNumber(){
        //TODO NIE WIEM JAK TO ZROBIC....
        //pewnie trzeba dodać takie pole w bazie
        //i rozkminić logikę generowania
        return '1231';
    }
}

module.exports = Room;




