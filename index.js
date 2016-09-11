var assert = require('assert');
var dbFuncString = String(dbFunc);
var debug = require('debug')('arango-up');
var lock = require('arango-lock');
var up = require('db-up');
var util = require('arango-util');

exports.update = function (options) {
    assert.ok(options, 'options should be provided.');

    var database = options.database;
    var key = options.name || 'master';
    var path = options.path;

    assert.ok(database, 'database should be an arangodb database object');

    return lock
        .acquire({ name: 'arango-up:' + key, database })
        .then(function (release) {
            var newVersion;
            var originVersion;
            var collection = database.collection('arangoUp');

            return util
                .ensureCollectionExists(collection)
                .then(_ => util.getByKey({ collection, key }))
                .then(applyUpdates)
                .then(saveNewVersion, handleErrorAndSave);

            function applyUpdates(e) {
                newVersion = originVersion = e && e.version || 0;

                if (e)
                    debug(`actual database version is ${originVersion} updated on ${new Date(e.date).toLocaleString()}.`);
                else
                    debug('no database record found. origin version set to 0.');

                return up.update({ version: newVersion, data: options.data, path, onAppliedPatch });
            }

            function handleErrorAndSave(err) {
                debug(`error:\n${err.toString()}`);
                return saveNewVersion().then(_ => Promise.reject(err));
            }

            function onAppliedPatch(e) {
                debug(`${e.patch.filename} applied.`);
                newVersion = e.patch.id;
            }

            function saveNewVersion() {
                if (newVersion === originVersion) {
                    debug('already up to date.');
                    release();
                    return Promise.resolve({ originVersion, newVersion, updated: false });
                }

                debug(`updated from version ${originVersion} to ${newVersion}.`);

                return database
                    .transaction({ write: 'arangoUp' }, dbFuncString, { key, version: newVersion, date: new Date() })
                    .then(function () {
                        debug('version persisted to database.');
                        release();
                        return { originVersion, newVersion, updated: true };
                    });
            }
        });
};

function dbFunc(params) {
    var versions = require('org/arangodb').db.arangoUp;
    var version = versions.documents([params.key]).documents[0];
    var newVersion = { date: params.date, version: params.version };

    if (version)
        versions.replace(params.key, newVersion);
    else {
        newVersion._key = params.key;
        versions.save(newVersion);
    }
}