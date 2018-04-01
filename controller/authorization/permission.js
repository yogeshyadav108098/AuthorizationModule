'use strict';

const PermissionApi = require('../../api/authorization/permission');

const options = {
    table: 'Permission',
    api: PermissionApi
};

let permissions = {
    basic: new (require('../base'))(options),
    custom: {}
};

module.exports = permissions;
