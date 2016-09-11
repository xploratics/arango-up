var util = require('arango-util');

module.exports = function (e) {
    return util.ensureCollectionExists(e.database.collection('users'));
};