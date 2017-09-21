const saveRoom = require('./RoomDao.js').saveRoom;

class Room {

    constructor(roomName, adminId){
        //Fields must have the same names as fields in database
        this.id = undefined;
        this.name = roomName;
        this.administrator_id = adminId;
        this.game_number = Room.generateGameNumber();


        this.saveToDatabaseAndSetDatabaseId();

        console.log(`New room: ${this.name}, id: loading from db, administrator_id: ${this.administrator_id}`);
    }

    saveToDatabaseAndSetDatabaseId(){
        let promise = saveRoom(this.name, this.administrator_id);
        promise.then((insertedId) => {
            this.id = insertedId;
            console.log("DatabaseId saved as Room property. [databaseId: " + this.id + "]");
        });
    }

    static generateGameNumber(){
        //TODO NIE WIEM JAK TO ZROBIC....
        //pewnie trzeba dodać takie pole w bazie - done :D
        //i rozkminić logikę generowania
        return '1231';
    }
}

module.exports = Room;




