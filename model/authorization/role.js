'use strict';

const Util = require('util');

const Config = require('../../config');
const RoleModel = require('../dbSchema/acl/role');
const Logger = require('../../lib/logger').getInstance();
const DbDefinitions = require('../dbDefinitions').getInstance();

const DbMaster = DbDefinitions.allDBs.dbAclMaster;
const RoleTable = Config.tables.authorization.role;

const filePrefix = 'Role Model:';

let tableOptions = {
    table: RoleTable,
    db: DbMaster,
    model: RoleModel
};

let role = new (require('../base'))(tableOptions);
Logger.debug(filePrefix, 'Global:', 'Role model initialized', JSON.stringify(Util.inspect(role)));

module.exports = role;
