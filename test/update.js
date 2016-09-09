var expect = require('chai').expect;
var server = require('arangojs')({ url: 'http://root@127.0.0.1:8529' });
var up = require('../');
var util = require('arango-util');

describe('update', function () {
    it('should not returns errors', function () {
        return util
            .ensureDatabaseExists({ server, name: 'db' })
            .then(_ => up.update({ server, data: { server }, path: './test/patches' }));
    });

    it('should update database', function () {
        return server
            .collection('users').document('user1')
            .then(d => expect(d.firstName).to.equal('John'));
    });

    it('should update the arangoUp table', function () {
        return server
            .collection('arangoUp').document('master')
            .then(d => expect(d.version).to.equal(2));
    });
});