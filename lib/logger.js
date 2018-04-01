'use strict';

const _ = require('lodash');
const Util = require('util');
const Path = require('path');
const Winston = require('winston');
require('winston-daily-rotate-file');
const Datetime = require('node-datetime');
const GetNamespace = require('continuation-local-storage').getNamespace;

const LoggerConfig = require('../config/logger');
const ThreadStorageHelper = require('../helpers/thread_storage');

let timeFormat = () => (new Datetime.create()).format('Y-m-d H:m:S.MS');
let LogPath = _.get(process.env, 'LOG_PATH') || '/tmp';
let LogLevel = _.get(process.env, 'LOG_LEVEL');

Winston.configure({
    transports: [
        new Winston.transports.Console({
            name: LoggerConfig.CONSOLE.NAME,
            level: LogLevel || LoggerConfig.CONSOLE.LOG_LEVEL,
            colorize: true,
            timestamp: timeFormat
        }),
        new Winston.transports.DailyRotateFile({
            name: LoggerConfig.FILE.PRETTY.NAME,
            filename: Path.join(LogPath, LoggerConfig.FILE.PRETTY.FILE_NAME),
            level: LogLevel || LoggerConfig.FILE.PRETTY.LOG_LEVEL,
            timestamp: () => new Date(),
            json: false,
            colorize: false,
            zippedArchive: true,
            maxDays: 15
        }),
        new Winston.transports.DailyRotateFile({
            name: LoggerConfig.FILE.JSON.NAME,
            filename: Path.join(LogPath, LoggerConfig.FILE.JSON.FILE_NAME),
            level: LogLevel || LoggerConfig.FILE.JSON.LOG_LEVEL,
            timestamp: () => new Date(),
            json: true,
            colorize: false,
            zippedArchive: true,
            maxDays: 15
        })
    ]
});


class Logger {
    constructor() {
        Winston.info('Initiating Service Logger...');
        return;
    }

    formatMessage(args, type) {
        let session = new GetNamespace('Request Session');
        let requestId = ThreadStorageHelper.getRequestId(session);

        let message = '';
        for (let i = 0; i < args.length; i++) {
            if (args[i]) {
                if (type === 'error') {
                    message += ' ' + (args[i].stack || args[i].message || args[i].error || args[i]);
                } else {
                    try {
                        message += ' ' + JSON.parse(JSON.stringify(args[i]));
                    } catch (error) {
                        // May be circular dependency
                        message += ' ' + JSON.parse(JSON.stringify(Util.inspect(args[i])));
                    }
                }
            }
        }

        message = requestId ? requestId.toString() + ':' + message : 'Service Logs: ' + message;
        return message;
    }

    log(...args) {
        Winston.info(this.formatMessage(args));
    }

    error(...args) {
        Winston.error(this.formatMessage(args, 'error'));
    }

    warn(...args) {
        Winston.warn(this.formatMessage(args));
    }

    verbose(...args) {
        Winston.verbose(this.formatMessage(args));
    }

    info(...args) {
        Winston.info(this.formatMessage(args));
    }

    debug(...args) {
        Winston.debug(this.formatMessage(args));
    }

    silly(...args) {
        Winston.silly(this.formatMessage(args));
    }

    stream() {
        let self = this;
        return {
            write: function(message) {
                self.info(message.trim());
            }
        };
    }
}

let loggerInstance;
module.exports.getInstance = function() {
    if (!loggerInstance) {
        loggerInstance = new Logger();
    }

    return loggerInstance;
};
