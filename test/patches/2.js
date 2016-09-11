var util = require('arango-util');

module.exports = function (e) {
    return e.database.collection('users').save({ _key: 'user1', firstName: 'John', lastName: 'Smith' });
};