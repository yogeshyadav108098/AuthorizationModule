'use strict';

const Config = require('../../config');
const RoleModel = require('../../model/authorization/role');

const RoleTable = Config.tables.authorization.role;


let discount = {
    basic: new (require('../base'))({
        filters: RoleTable.FILTERS,
        columns: RoleTable.COLUMNS,
        updatableColumns: RoleTable.UPDATABLE_COLUMNS,
        restrictedColumns: RoleTable.RESTRICTED_COLUMNS,
        patternMatchColumns: RoleTable.PATTERN_MATCH_COLUMNS,
        model: RoleModel,
        commonName: RoleTable.COMMON_NAME
    }),
    custom: {}
};

module.exports = discount;
