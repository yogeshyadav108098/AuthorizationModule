'use strict';

const Q = require('q');

const Logger = require('../../lib/logger').getInstance();
const ResponseCodes = require('../../helpers/response_code');

const filePrefix = 'Error Controller:';
class Error {
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

    handleError(error, req, res, next) {
        let status = error.status || ResponseCodes.INTERNAL_SERVER_ERROR.status;

        let response = {
            message: error.message || error,
            stack: error.stack ? error.stack.split('\n') : '',
            code: error.code
        };

        if (process.env.NODE_ENV.toLowerCase() === 'production') {
            response.stack = undefined;
        }

        return res.status(status).json(response);
    }
}

module.exports = Error;
