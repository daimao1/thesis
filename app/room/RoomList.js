//const Room = require('./Room.js');

let roomList = [];

function add(room) {
    roomList.push(room);
}

function deleteByGameNumber(number){
    "use strict";

    roomList.forEach((room, index) => {
        if(room.gameNumber === number){
            roomList.splice(index);
            //return;
        }
    });
}

function deleteOne(room) {
    const index = roomList.indexOf(room);
    roomList.splice(index, index);
}
