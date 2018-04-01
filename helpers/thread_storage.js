'use strict';

// 3rd Party
const Q = require('q');
const _ = require('lodash');
const Uuid = require('uuid');
const PatchQ = require('cls-q');
const patchRedis = require('cls-redis');
const patchMongoose = require('cls-mongoose');
const patchBlueBird = require('cls-bluebird');
const PatchMiddleware = require('cls-middleware');
const CreateNamespace = require('continuation-local-storage').createNamespace;

// Internal
const RequestConfig = require('../config/request');

let session = CreateNamespace(RequestConfig.SESSION_NAME);

new PatchQ(session);
new patchRedis(session);
new patchMongoose(session);
new patchBlueBird(session);
new PatchMiddleware(session);

module.exports = {
    addRequestId: function(req, res, next) {
        session.run(function() {
            session.set(RequestConfig.REQUEST_IDENTIFIER, Uuid.v4());
            return next();
        });
    },

    getRequestId: function(request) {
        if (!request) {
            return undefined;
        }
        return request.get(RequestConfig.REQUEST_IDENTIFIER);
    },

    addRequestIdApi: function(options) {
        let deferrd = Q.defer();
        session.run(function() {
            let reqId = _.get(options, 'uuid', undefined) || Uuid.v4();
            session.set(RequestConfig.REQUEST_IDENTIFIER, reqId);
            return deferrd.resolve();
        });

        return deferrd.promise;
    }
};
