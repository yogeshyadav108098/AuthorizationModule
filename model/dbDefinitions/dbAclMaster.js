'use strict';

const dbAclMasterConfigs = {
    development: {
        host: 'localhost',
        port: 27017,
        user: 'AclMaster',
        password: 'AclDbaAbBw1308Software',
        database: 'acl',
        poolsize: 10
    },

    staging: {
        host: 'localhost',
        port: 27017,
        user: 'AclMaster',
        password: 'AclDbaAbBw1308Software',
        database: 'acl',
        poolsize: 10
    },

    production: {
        host: 'localhost',
        port: 27017,
        user: 'AclMaster',
        password: 'AclDbaAbBw1308Software',
        database: 'acl',
        poolsize: 10
    }
};

const dbAclMaster = dbAclMasterConfigs[process.env.NODE_ENV || 'development'];

module.exports = require('rc')('dbAclMaster', dbAclMaster);
