'use strict';

var dbAclSlaveConfigs = {
    development: {
        host: 'localhost',
        user: 'AclSlave',
        password: 'AclDbqAwQw1208Slave',
        database: 'acl',
        poolsize: 10
    },

    staging: {
        host: 'localhost',
        user: 'AclSlave',
        password: 'AclDbqAwQw1208Slave',
        database: 'acl',
        poolsize: 10
    },

    production: {
        host: 'localhost',
        user: 'AclSlave',
        password: 'AclDbqAwQw1208Slave',
        database: 'acl',
        poolsize: 10
    }
};

var dbAclSlave = dbAclSlaveConfigs[process.env.NODE_ENV || 'development'];

module.exports = require('rc')('dbAclSlave', dbAclSlave);
