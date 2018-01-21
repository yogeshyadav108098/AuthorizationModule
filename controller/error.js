'use strict';

class Error {

    constructor(options, controller) {
        let self = this;
        self.logger = controller.logger;
        return;
    }

    init(options) {
        return;
    }

    handleError(error, req, res, next) {
        let self = this;
        let status = error.status || 500;

        let response = {
            error: error.message || error,
            stack: error.stack ? error.stack.split('\n') : '',
            code: error.code
        };

        if (status >= 500) {
            self.logger.error(error);
        }

        if (process.env.NODE_ENV.toLowerCase() === 'production') {
            response.stack = undefined;
        }

        return res.status(status).json(response);
    }
}

module.exports = Error;