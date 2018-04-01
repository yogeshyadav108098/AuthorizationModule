'use strict';

const UserApi = require('../../api/authorization/user');

const options = {
    table: 'User',
    api: UserApi
};

let users = {
    basic: new (require('../base'))(options),
    custom: {}
};

module.exports = users;
