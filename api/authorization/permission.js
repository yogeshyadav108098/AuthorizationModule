'use strict';

const Config = require('../../config');
const PermissionModel = require('../../model/authorization/permission');

const PermissionTable = Config.tables.authorization.permission;


let discount = {
    basic: new (require('../base'))({
        filters: PermissionTable.FILTERS,
        columns: PermissionTable.COLUMNS,
        updatableColumns: PermissionTable.UPDATABLE_COLUMNS,
        restrictedColumns: PermissionTable.RESTRICTED_COLUMNS,
        patternMatchColumns: PermissionTable.PATTERN_MATCH_COLUMNS,
        model: PermissionModel,
        commonName: PermissionTable.COMMON_NAME
    }),
    custom: {}
};

module.exports = discount;
