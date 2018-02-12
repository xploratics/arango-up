var expect = require('chai').expect;
var database = require('arangojs')({
    url: 'http://127.0.0.1:8529'
}).useDatabase('db').useBasicAuth('root', '');
var up = require('../');
var util = require('arango-util');

describe('update', function () {
    it('should not returns errors', function () {
        return util
            .ensureDatabaseExists(database)
            .then(_ => up.update({
                database,
                data: {
                    database
                },
                path: './test/patches'
            }))
            .then(function (e) {
                expect(e.originVersion).to.equal(0);
                expect(e.newVersion).to.equal(2);
                expect(e.updated).to.be.true;
            });
    });

    it('should update database', function () {
        return database
            .collection('users').document('user1')
            .then(d => expect(d.firstName).to.equal('John'));
    });

    it('should update the arangoUp table', function () {
        return database
            .collection('arangoUp').document('master')
            .then(d => expect(d.version).to.equal(2));
    });

    it('should not returns errors when db is already updated', function () {
        return up
            .update({
                database,
                data: {
                    database
                },
                path: './test/patches'
            })
            .then(function (e) {
                expect(e.originVersion).to.equal(2);
                expect(e.newVersion).to.equal(2);
                expect(e.updated).to.be.false;
            });
    });
});