//http://mochajs.org/#installation

const assert1 = require('assert'); //chyba z nodeJs
const assert2 = require('chai').assert; //chai

beforeEach(function() {
    console.log('before every test in every file');
});

describe('Array', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert1.equal(-1, [1,2,3].indexOf(4));
        });
    });
});

describe('Test', function () {
    it('opiscostma', function () {
        assert2.equal(2,2);
    });
});