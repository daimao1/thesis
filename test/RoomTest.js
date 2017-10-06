const expect = require('chai').expect;
const assert = require('chai').assert;
const Room = require('../app/room/Room');

let room;
describe("Room", () => {

    before(() => {
        room = new Room(1, "GameName", 1, undefined);
        for (i = 0; i < room.MAX_PLAYERS; i++) {
            room.addPlayer(undefined);
        }
    });

    describe("#addPlayer()", () => {
        it("should throw exception when room full", () => {
            expect(room.addPlayer.bind(undefined)).to.throw();
        });
    });

    describe('#removePlayers()', () => {
        it('should remove all players from room', () => {
            room.removePlayers();
            assert.equal(room.players.length, 0, 'no players in room');
        });
    });
});