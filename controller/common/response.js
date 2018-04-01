'use strict';

const Q = require('q');
const _ = require('lodash');
const JsonToCsv = require('json2csv'); // Function

const Logger = require('../../lib/logger').getInstance();
const ResponseCodes = require('../../helpers/response_code');

const filePrefix = 'Response Controller:';
class Response {
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

    setResponse(req, res, next) {
        let functionPrefix = 'Set Response:';
        req.response = _.get(req, 'lastMiddlewareResponse.respToSend', ResponseCodes.INTERNAL_SERVER_ERROR.message);
        req.status = _.get(req, 'lastMiddlewareResponse.status', ResponseCodes.INTERNAL_SERVER_ERROR.status);
        Logger.info(filePrefix, functionPrefix, JSON.stringify(req.response), ' and status : ', req.status);
        return next();
    }

    sendResponse(req, res, next) {
        let functionPrefix = 'Send Response:';
        if (!req.response || !req.status) {
            return this.sendFailure(next, ResponseCodes.custom({
                message: 'Status is not set till now, yet send Response Called',
                status: ResponseCodes.INTERNAL_SERVER_ERROR.status,
                code: ResponseCodes.INTERNAL_SERVER_ERROR.code
            }));
        }
        Logger.info(filePrefix, functionPrefix, JSON.stringify(req.response), ' and status : ', req.status);
        return res.status((req && req.status) || 200).send(req && req.response);
    }

    sendFailure(next, responseCode) {
        let functionPrefix = 'Send Failure:';
        let error = new Error();
        error.message = _.get(responseCode, 'message', ResponseCodes.INTERNAL_SERVER_ERROR.message);
        error.status = _.get(responseCode, 'status', ResponseCodes.INTERNAL_SERVER_ERROR.status);
        error.code = _.get(responseCode, 'code', ResponseCodes.INTERNAL_SERVER_ERROR.code);
        Logger.info(filePrefix, functionPrefix, error.message);
        return next(error);
    }

    sendResponseInCSV(req, res, next) {
        let functionPrefix = 'Send Response InCSV:';
        let self = this;
        let jsonData = req.response;
        let fileName = req.fileNameToSend || 'download_' + new Date().toISOString();

        if (typeof jsonData !== 'object') {
            Logger.error(filePrefix, functionPrefix, 'JSON Content should be either object or array, given is none');
            return self.sendFailure(next, ResponseCodes.INVALID_JSON_CONTENT);
        }

        if (!jsonData.length) {
            jsonData = [jsonData];
        }

        try {
            res.set('Content-Disposition', 'attachment; filename="' + fileName + '.csv"');
            let csvData = new JsonToCsv(jsonData);
            res.write(csvData);
            return res.end();
        } catch (err) {
            return self.sendFailure(next, ResponseCodes.UNABLE_TO_PROCESS);
        }
    }
}

module.exports = Response;
