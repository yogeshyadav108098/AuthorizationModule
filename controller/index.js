'use strict';

const Q = require('q');

const AuthController = require('./common/auth');
const ErrorController = require('./common/error');
const ApiDocController = require('./common/apidoc');
const Logger = require('../lib/logger').getInstance();
const AclController = require('./authorization/index');
const ResponseController = require('./common/response');
const HealthCheckController = require('./common/healthcheck');
const DbInstance = require('../model/dbDefinitions').getInstance();

const filePrefix = 'Main Controller:';
class Controller {
    constructor(options) {
        let self = this;
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        self.Auth = new AuthController(options, self);
        self.Acl = new AclController(options, self);
        self.Error = new ErrorController(options, self);
        self.ApiDoc = new ApiDocController(options, self);
        self.Response = new ResponseController(options, self);
        self.HealthCheck = new HealthCheckController(options, self);
        self.DbInstance = DbInstance;
        Logger.info(filePrefix, functionPrefix, 'Constructed');
        return;
    }

    init(options) {
        let self = this;
        let functionPrefix = 'Init:';
        let deferred = Q.defer();

        new Q(undefined)
            .then(function() {
                Logger.info(filePrefix, functionPrefix, 'Initiating...');
                return Q.resolve();
            })
            .then(function() {
                return self.DbInstance.init();
            })
            .then(function() {
                return self.Acl.init();
            })
            .then(function() {
                return self.Auth.init();
            })
            .then(function() {
                return self.Error.init();
            })
            .then(function() {
                return self.ApiDoc.init();
            })
            .then(function() {
                return self.Response.init();
            })
            .then(function() {
                return self.HealthCheck.init();
            })
            .then(function() {
                Logger.info(filePrefix, functionPrefix, 'Initiated...');
                return deferred.resolve();
            })
            .fail(function(error) {
                return deferred.reject(error);
            });
        return deferred.promise;
    }
}

module.exports = Controller;
