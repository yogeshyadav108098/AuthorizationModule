'use strict';

const Q = require('q');
const _ = require('lodash');

const Logger = require('../../lib/logger').getInstance();
const ResponseCodes = require('../../helpers/response_code');

const filePrefix = 'HealthCheck Controller:';
class HealthCheck {
    constructor(options, controller) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Constructing...');
        return;
    }

    init(options) {
        let functionPrefix = 'Init:';
        Logger.info(filePrefix, functionPrefix, 'Initiating...');
        return Q.resolve();
    }

    healthCheck(req, res, next) {
        let responseMessage = {
            result: 'OK'
        };

        _.set(req, 'lastMiddlewareResponse', {
            status: ResponseCodes.OK.status,
            respToSend: responseMessage
        });

        Logger.info('HealthCheck is working fine');
        return next();
    }
}
module.exports = HealthCheck;
