'use strict';

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

        self.logger.info('Status check : Working fine');
        return res.status(200).json(responseMessage);
    }
}

module.exports = HealthCheck;