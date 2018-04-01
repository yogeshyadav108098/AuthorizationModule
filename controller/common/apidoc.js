'use strict';

const Q = require('q');
const Path = require('path');
const Exec = require('child_process').exec;
const Logger = require('../../lib/logger').getInstance();

const filePrefix = 'ApiDoc Controller:';
class ApiDoc {
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

    runApiDoc(req, res, next) {
        let self = this;
        Exec('ls -la | grep apiDocs', function(error, stdout, stderr) {
            if (!error) {
                // ApiDocs folder exist, can ignore regeneration
                self.logger.info('ApiDocs folder exist, can ignore regeneration');
                return next();
            }

            Exec('apidoc -i routes/ -o apiDocs/', function(error, stdout, stderr) {
                if (error) {
                    return next(error);
                }
                return next();
            });
        });
    }

    renderApiDoc(req, res, next) {
        let indexFilePath = Path.join(__dirname, '../../apiDocs/index.html');
        return res.sendFile(indexFilePath);
    }
}

module.exports = ApiDoc;
