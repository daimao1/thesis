process.env = test;
const expect = require('chai').expect;
// const assert = require('chai').assert;
const RoomService = require('../../app/room/RoomService');
//const Room = require('../../app/room/Room');
//const Player = require('../../app/player/Player');

describe("RoomService", function() {

    // let player;
    // let room;

    before( function () {
        // const roomId = 1;
        // room = new Room(roomId,'roomName',1,undefined);
        // player = new Player(roomId, undefined);
    });

    describe('addPlayerToRoom', function () {

        it('should throw error when player undefined', function () {
            expect(RoomService.addPlayerToRoom(undefined)).to.throw();
        });
    });

    describe('removePlayer', function () {

        it('should throw error when player undefined', function () {
            expect(RoomService.removePlayer.bind(undefined)).to.throw();
        });
    });
});