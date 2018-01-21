'use strict';

module.exports = function (app, controllerObject) {

    /**
     * @api {get} /apiDoc API DOC
     * @apiName APIDoc
     * @apiGroup APIDoc
     *
     * @apiSuccessExample Success-Response:
     *   html page
     */
    app.get('/apiDoc',
        controllerObject.ApiDoc.runApiDoc.bind(controllerObject.ApiDoc),
        controllerObject.ApiDoc.renderApiDoc.bind(controllerObject.ApiDoc),
        controllerObject.Error.handleError.bind(controllerObject.Error)
    );

};