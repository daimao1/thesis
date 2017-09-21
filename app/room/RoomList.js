//const Room = require('./Room.js');

const RoomDao = require('./RoomDao.js');


let roomList = [];

exports.add = function (room) {
    roomList.push(room);
};

exports.deleteByGameNumber = function (number){
    "use strict";
    for (let [index, room] of roomList) {
        if(room.gameNumber === number){
            roomList.splice(index); //TODO test!!!
        }
    }
};

exports.deleteOne = function (room) {
    const index = roomList.indexOf(room);
    roomList.splice(index, index);
};

exports.getAll = function () {
    "use strict";
    console.log("RoomList: " + roomList);
    return roomList;
};

exports.loadDataFromDb = function () {
    "use strict";
    let data;
    let promise = RoomDao.getAll();
    promise.then((rows) => {
        data = rows;
        console.log("Data loaded from database successfully (Rooms table)");
        //console.log(data[0].room_name);
        //roomList = data;
    });

};