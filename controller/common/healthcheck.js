'use strict';

const _ = require('lodash');
const ResponseCodes = require('../../helpers/response_code');

class HealthCheck {

    constructor(options, controller) {
        let self = this;
        self.logger = controller.logger;
        return;
    }

    init(options) {
        return;
    }

    healthCheck(req, res, next) {
        let self = this;

        let responseMessage = {
            result: 'OK'
        };

        _.set(req, 'last_middleware_response', {
            status: ResponseCodes.OK.status,
            respToSend: responseMessage
        });

        self.logger.info('Status check : Working fine');
        return next();
    }
}

module.exports = HealthCheck;