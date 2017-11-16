process.env.NODE_ENV = 'test';
const assert = require('chai').assert;
let dbScript = require('../../scripts/create_test_database_function');
let db = require('../../app/config/dbconnection');
let PlayerDao;

describe('PlayerDao', function () {

    before(function (done) {
        this.timeout(4000); //long timeout due to clearing database
        function importPlayer() {
            PlayerDao = require('../../app/player/PlayerDao');
        }

        dbScript.dropAndCreateDatabase().then(function () {
            importPlayer();
            done();
        }).catch(done);

    });

    const name_1 = 'FirstPlayerName';
    describe('#savePlayer()', function () {
        it('should return id of inserted row', function (done) {
            console.log('test1');
            PlayerDao.savePlayer(name_1, 0, 1, 0)
                .then(function (insertedId) {
                    assert(insertedId !== undefined);
                    assert.equal(insertedId, 2); // second player
                    done();
                }).catch(done);
        });
    });
    describe('#getAll()', function () {
        it('should get 1 added players', function (done) {
            console.log('test2');
            PlayerDao.getAll().then(function (rows) {
                assert.equal(rows.length, 2, 'player added by previous test and sample player from db');
                assert.equal(rows[1].id, 2, 'player added by previous test');
                assert.equal(rows[1].name, name_1, 'player added by previous test');
                done();
            }).catch(done);
        });
    });

    after(function (done) {
        this.timeout(4000);
        db.endConnection();
        dbScript.dropAndCreateDatabase().then(done).catch(done);
    });
});
