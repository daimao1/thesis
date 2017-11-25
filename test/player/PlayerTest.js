process.env.NODE_ENV = 'test';
const Player = require('../../app/player/Player');

describe('Player', function () {

    let player;
    beforeEach(function() {
        player = new Player(1, 1, 1, undefined);
    });
    // describe('#setName()', function () {
    //     it('should set name property', function () {
    //         const name = 'nickname';
    //         player.setName(name);
    //         assert.equal(player.name, name);
    //     });
    //     it('should throw error if name is already set', function () {
    //         expect(player.setName.bind('test name')).to.throw();
    //     });
    // });
});