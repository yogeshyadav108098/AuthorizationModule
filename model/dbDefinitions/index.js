'use strict';

const Q = require('q');
const _ = require('lodash');
const Logger = require('../../lib/logger').getInstance();


const filePrefix = 'AllDBs Model:';
class AllDbBs {
    constructor(options, controller) {
        let functionPrefix = 'Constructor:';
        let self = this;
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        self.allDBs = {};
    }

    init(options) {
        let functionPrefix = 'Init:';
        let self = this;
        Logger.info(filePrefix, functionPrefix, 'Initiating...');

        let deferred = Q.defer();
        new Q(undefined)
            .then(function() {
                Logger.debug(filePrefix, functionPrefix, 'Loading dbAclMaster');
                return self.defineDB('dbAclMaster');
            })
            .then(function() {
                Logger.debug(filePrefix, functionPrefix, 'All DBs successfully loaded');
                return deferred.resolve();
            })
            .fail(function(error) {
                Logger.error(filePrefix, functionPrefix, error);
                return deferred.reject(error);
            });
        return deferred.promise;
    }

    defineDB(name) {
        let functionPrefix = 'DefineDB:';
        let self = this;
        let deferred = Q.defer();

        new Q(undefined)
            .then(function() {
                return require('./db')(require('./' + name));
            })
            .then(function(response) {
                Logger.debug(filePrefix, functionPrefix, 'Setting in all Dbs', name);
                _.set(self.allDBs, name, response);
                return deferred.resolve();
            })
            .fail(function(error) {
                Logger.error(filePrefix, functionPrefix, error);
                return deferred.reject(error);
            });
        return deferred.promise;
    }
}

let dbInstance;
module.exports.getInstance = function() {
    if (!dbInstance) {
        dbInstance = new AllDbBs();
    }

    return dbInstance;
};
