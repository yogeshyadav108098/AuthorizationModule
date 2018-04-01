'use strict';

const RoleApi = require('../../api/authorization/role');

const options = {
    table: 'Role',
    api: RoleApi
};

let roles = {
    basic: new (require('../base'))(options),
    custom: {}
};

module.exports = roles;
