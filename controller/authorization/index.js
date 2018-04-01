'use strict';

const Q = require('q');

const Logger = require('../../lib/logger').getInstance();

const filePrefix = 'Acl Controller:';
class AclController {
    constructor(options, controller) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        return;
    }

    init(options) {
        let functionPrefix = 'Init:';
        let self = this;
        Logger.info(filePrefix, functionPrefix, 'Constructing user');
        self.user = require('./user');
        Logger.info(filePrefix, functionPrefix, 'Constructing role');
        self.role = require('./role');
        Logger.info(filePrefix, functionPrefix, 'Constructing permission');
        self.permission = require('./permission');
        Logger.info(filePrefix, functionPrefix, 'Initiating...');
        return Q.resolve();
    }
}

module.exports = AclController;
