'use strict';

const Logger = require('../lib/logger');
const ApiDoc = require('./apidoc/apidoc');
const ErrorController = require('./error');
const HealthCheck = require('./common/healthcheck');

class Controller {

    constructor(options) {
        let self = this;
        self.logger = Logger;
        self.ApiDoc = new ApiDoc(options, self);
        self.Error = new ErrorController(options, self);
        self.HealthCheck = new HealthCheck(options, self);
    }
}

module.exports = Controller;