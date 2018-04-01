'use strict';

const Util = require('util');

const Config = require('../../config');
const Logger = require('../../lib/logger').getInstance();
const PermissionModel = require('../dbSchema/acl/permission');
const DbDefinitions = require('../dbDefinitions').getInstance();

const DbMaster = DbDefinitions.allDBs.dbAclMaster;
const PermissionTable = Config.tables.authorization.permission;

const filePrefix = 'Permission Model:';

let tableOptions = {
    table: PermissionTable,
    db: DbMaster,
    model: PermissionModel
};

let permission = new (require('../base'))(tableOptions);
Logger.debug(filePrefix, 'Global:', 'Permission model initialized', JSON.stringify(Util.inspect(permission)));

module.exports = permission;
