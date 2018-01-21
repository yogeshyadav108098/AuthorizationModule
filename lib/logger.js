'use strict';

const _ = require('lodash');
const Path = require('path');
const Winston = require('winston');
const GetNamespace = require('continuation-local-storage').getNamespace;

const LoggerConfig = require('../config/logger');
const RequestConfig = require('../config/request');
const ThreadStorageHelper = require('../helpers/thread_storage');

require('winston-daily-rotate-file');

let timeFormat = () => new Date();

let LogPath = _.get(process.env, 'LOG_PATH');

Winston.configure({
    transports: [
        new(Winston.transports.Console)({
            name: LoggerConfig.CONSOLE.NAME,
            level: LoggerConfig.CONSOLE.LOG_LEVEL,
            colorize: true,
            timestamp: timeFormat
        }),
        new(Winston.transports.DailyRotateFile)({
            name: LoggerConfig.FILE.NAME,
            filename: Path.join(LogPath, LoggerConfig.FILE.FILE_NAME),
            level: LoggerConfig.FILE.LOG_LEVEL,
            timestamp: timeFormat,
            json: false,
            colorize: false
        })
    ]
});

let formatMessage = function (message) {
    let session = GetNamespace('Request Session');
    let requestId = ThreadStorageHelper.getRequestId(session);
    message = requestId ? requestId.toString() + ' : ' + message : 'Service Logs : ' + message;
    return message;
};

let Logger = {
    log: function (level, message) {
        Winston.log(level, formatMessage(message));
    },
    error: function (message) {
        Winston.error(formatMessage(message));
    },
    warn: function (message) {
        Winston.warn(formatMessage(message));
    },
    verbose: function (message) {
        Winston.verbose(formatMessage(message));
    },
    info: function (message) {
        Winston.info(formatMessage(message));
    },
    debug: function (message) {
        Winston.debug(formatMessage(message));
    },
    silly: function (message) {
        Winston.silly(formatMessage(message));
    },
    stream() {
        var self = this;
        return {
            write: function (message, encoding) {
                self.info(message.trim());
            }
        };
    }
};

module.exports = Logger;