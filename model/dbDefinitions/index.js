'use strict';

var _ = require('lodash');

var allDBs = {};

function defineDB(name) {
    var propName = name;

    Object.defineProperty(allDBs, propName, {
        get: function lazydefine() {
            if (!allDBs[propName]) {
                allDBs[propName] = require('./db')(require('./' + name));
            }
            return allDBs[propName];
        }
    });
}

defineDB('dbAclSlave');
defineDB('dbAclMaster');

module.exports = allDBs;