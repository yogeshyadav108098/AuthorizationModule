'use strict';

const Path = require('path');
const Exec = require('child_process').exec;

class ApiDoc {
    constructor(options, controller) {
        let self = this;
        self.logger = controller.logger;
        return;
    }

    init(options) {
        return;
    }

    runApiDoc(req, res, next) {

        let self = this;
        Exec('ls -la | grep apiDocs', function (error, stdout, stderr) {

            if (!error) {
                // ApiDocs folder exist, can ignore regeneration
                self.logger.info('ApiDocs folder exist, can ignore regeneration');
                return next();
            }

            Exec('apidoc -i routes/ -o apiDocs/', function (error, stdout, stderr) {
                if (error) {
                    return next(error);
                    // return Response.sendFailure(next, ResponseCodes.custom('Not able to generate API Doc', 204, 'NO_DATA'));
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