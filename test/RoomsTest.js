const expect = require('chai').expect;
const Rooms = require('../app/room/Rooms');

describe("Rooms test", () => {

    beforeEach(() => {
        console.log('before each');
    });

    it("when new room was created, then user can get it by his id", () => {
        Rooms.new("game", 1);

        const tab = Rooms.findByAdminId(1);
        expect(tab[0].name).to.eql("game");
    });
});