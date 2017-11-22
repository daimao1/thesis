process.env.NODE_ENV = 'test';
const assert = require('chai').assert;
const expect = require('chai').expect;
const Room = require('../../app/room/Room');
const Player = require('../../app/player/Player');

describe("Room", function () {

    let room;
    let player1;
    let player2;
    let fakeSocketNamespace;

    before(function () {
        fakeSocketNamespace = {roomId: 1};
        room = new Room(1, "GameName", 1, fakeSocketNamespace);
        player1 = new Player(1, undefined, 'FirstGamer');
    });

    describe("#addPlayer()", function () {

        beforeEach(function () {
            room = new Room(1, "GameName", 1, fakeSocketNamespace);
        });

        it("should set player.inRoomId", () => {
            room.addPlayer(player1);
            assert.equal(player1.in_room_id, 0, 'First added player should have index [0]');
        });
        it("should throw exception when room full", () => {
            for (let i = 0; i < Room.MAX_PLAYERS; i++) {
                room.addPlayer(player1);
            }
            expect(room.addPlayer.bind(undefined)).to.throw();
        });
    });

    describe('#removeAllPlayers()', function () {
        before(function () {
            assert.equal(room.players.length, Room.MAX_PLAYERS, 'check if room full');
        });
        it('should remove all players from room', function () {
            room.removeAllPlayers();
            assert.equal(room.players.length, 0, 'no players in room');
        });
    });

    describe('#removeOnePlayer()', function () {
        before(function () {
            player1 = new Player(1, 'first gamer', 1, 1, undefined);
            player2 = new Player(2, 'second gamer', 2, 1, undefined);
            room.addPlayer(player1);
            room.addPlayer(player2);
            assert.equal(room.players.length, 2, '2 players in room');
        });
        it('should remove one specific player from room', function () {
            room.removePlayer(player1);
            assert.equal(room.players.length, 1, '1 players in room');
            assert.equal(room.players[0].name, player2.name);

            room.removePlayer(player2);
            assert.equal(room.players.length, 0, 'room empty');
        });
        it("should throw exception when room empty", function () {
            assert.equal(room.players.length, 0, 'room empty');
            expect(room.removePlayer.bind(player1)).to.throw();
        });
    });
});