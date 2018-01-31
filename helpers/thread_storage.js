'use strict';

const patchQ = require('cls-q');
const Uuid = require('node-uuid');
const patchRedis = require('cls-redis');
const PatchMysql = require('cls-mysql');
const patchMongoose = require('cls-mongoose');
const patchBlueBird = require('cls-bluebird');
const PatchMiddleware = require('cls-middleware');
const CreateNamespace = require('continuation-local-storage').createNamespace;

const RequestConfig = require('../config/request');

let session = CreateNamespace(RequestConfig.SESSION_NAME);

patchQ(session);
patchRedis(session);
patchMongoose(session);
patchBlueBird(session);
PatchMiddleware(session);

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