var util = require('arango-util');

module.exports = function (e) {
    return util.ensureCollectionExists({ server: e.server, name: 'users' });
};