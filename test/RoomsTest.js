const expect = require('chai').expect;
const Rooms = require('./room/RoomService');

describe("Rooms test", () => {

    beforeEach(() => {
        console.log('before each');
    });

    it("when new room was created, then user can get it by his id", () => {
        Rooms.newRoom("game", 1);

        const tab = Rooms.getByAdminId(1);
        expect(tab[0].name).to.eql("game");
    });
});