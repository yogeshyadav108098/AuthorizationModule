'use strict';

module.exports = function (app, controllerObject) {

    /**
     * @api {get} /_status Health Check Status
     * @apiName HealthCheckStatus
     * @apiGroup HealthCheck
     *
     * @apiSuccessExample Success-Response:
     * {
     *    result: 'OK'
     * }
     */
    app.get('/_status',
        controllerObject.HealthCheck.healthCheck.bind(controllerObject.HealthCheck),
        controllerObject.Response.setResponse.bind(controllerObject.Response),
        controllerObject.Response.sendResponse.bind(controllerObject.Response),
        controllerObject.Error.handleError.bind(controllerObject.Error)
    );

};