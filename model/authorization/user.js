'use strict';

const Util = require('util');

const Config = require('../../config');
const UserModel = require('../dbSchema/acl/user');
const Logger = require('../../lib/logger').getInstance();
const DbDefinitions = require('../dbDefinitions').getInstance();

const DbMaster = DbDefinitions.allDBs.dbAclMaster;
const UserTable = Config.tables.authorization.user;

const filePrefix = 'User Model:';

let tableOptions = {
    table: UserTable,
    db: DbMaster,
    model: UserModel
};

let user = new (require('../base'))(tableOptions);
Logger.debug(filePrefix, 'Global:', 'User model initialized', JSON.stringify(Util.inspect(user)));

module.exports = user;
