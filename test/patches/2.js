var util = require('arango-util');

module.exports = function (e) {
    return e.server.collection('users').save({ _key: 'user1', firstName: 'John', lastName: 'Smith' });
};