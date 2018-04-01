'use strict';

const Config = require('../../config');
const UserModel = require('../../model/authorization/user');

const UserTable = Config.tables.authorization.user;


let discount = {
    basic: new (require('../base'))({
        filters: UserTable.FILTERS,
        columns: UserTable.COLUMNS,
        updatableColumns: UserTable.UPDATABLE_COLUMNS,
        restrictedColumns: UserTable.RESTRICTED_COLUMNS,
        patternMatchColumns: UserTable.PATTERN_MATCH_COLUMNS,
        model: UserModel,
        commonName: UserTable.COMMON_NAME
    }),
    custom: {}
};

module.exports = discount;
