'use strict';

const Uuid = require('node-uuid');
const CreateNamespace = require('continuation-local-storage').createNamespace;

const RequestConfig = require('../config/request');

let session = CreateNamespace(RequestConfig.SESSION_NAME);

module.exports = {

    addRequestId: function (req, res, next) {
        session.run(function () {
            session.set(RequestConfig.REQUEST_IDENTIFIER, Uuid.v4());
            return next();
        });
    },

    getRequestId: function (request) {
        if (!request) {
            return undefined;
        }
        return request.get(RequestConfig.REQUEST_IDENTIFIER);
    }
};