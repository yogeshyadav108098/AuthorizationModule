'use strict';

const _ = require('lodash');
const JsonToCsv = require('json2csv');
const ResponseCodes = require('../../helpers/response_code');

class Response {

    constructor(options, controller) {
        let self = this;
        self.logger = controller.logger;
        return;
    }

    init(options) {
        return;
    }

    setResponse(req, res, next) {
        let self = this;
        req.response = _.get(req, 'last_middleware_response.respToSend');
        req.status = _.get(req, 'last_middleware_response.status');
        self.logger.info('Setting Response : ' + JSON.stringify(req.response) + ' and status : ' + req.status);
        return next();
    }

    sendResponse(req, res, next) {
        let self = this;
        self.logger.info('Sending Response : ' + JSON.stringify(req.response) + ' and status : ' + req.status);
        return res.status(req && req.status || 200).send(req && req.response);
    }

    sendFailure(next, responseCode) {
        let error = new Error();
        error.message = _.get(responseCode, 'message') || "Unknown error occured";
        error.status = _.get(responseCode, 'status') || 500;
        error.code = _.get(responseCode, 'code');
        return next(error);
    }

    sendResponseInCSV(req, res, next) {
        let self = this;
        let json_data = req.response;
        let fileName = req.fileNameToSend || ("download_" + new Date().toISOString());

        if (typeof (json_data) !== 'object') {
            return self.sendFailure(next, ResponseCodes.INVALID_JSON_CONTENT);
        }

        if (!json_data.length) {
            json_data = [json_data];
        }

        try {
            res.set('Content-Disposition', 'attachment; filename="' + fileName + '.csv"');
            let csv_data = JsonToCsv(json_data);
            res.write(csv_data);
            return res.end();
        } catch (err) {
            return self.sendFailure(next, ResponseCodes.UNABLE_TO_PROCESS);
        }
    }
}

module.exports = Response;