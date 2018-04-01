'use strict';

const {bind} = require('../lib/utils').getInstance();

module.exports = function(app, controllerObject) {
    /**
     * @api {post} /user/add Add
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiParam {String} email Email
     * @apiParam {Number} phone Phone
     *
     *
     * @apiSuccessExample Success-Response:
     *   {
     *        id:  1
     *        result: User created successfully
     *   }
     */
    app.post('/authorization/v1/user/add',
        bind(controllerObject.Acl.user.basic, 'create'),
        bind(controllerObject.Response, 'setResponse'),
        bind(controllerObject.Response, 'sendResponse'),
        bind(controllerObject.Error, 'handleError')
    );
};
