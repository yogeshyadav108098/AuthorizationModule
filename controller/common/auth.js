'use strict';

const Q = require('q');
const _ = require('lodash');

const Response = new (require('./response'))();
const Logger = require('../../lib/logger').getInstance();
const ResponseCodes = require('../../helpers/response_code');
const AllowedOrigins = require('../../config/allowed_origin');

const filePrefix = 'Auth Controller:';
class AuthController {
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

    fetchTokenOrCookie(req, res, next) {
        // If Persona token, ignore session id
        let authToken = _.get(req, 'headers.authtoken');
        if (authToken) {
            return next();
        }

        // If no persona token, use session id
        let cookieCSRSessionId;
        let cookie = req.headers.cookie || req.headers.custom_cookie;
        if (!cookie) {
            return Response.sendFailure(next, ResponseCodes.NO_TOKEN_USER_UNAUTHORIZED);
        }

        let cookieData = cookie.split(';');
        cookieData.forEach(function(key) {
            let cookieKey = key.split('=');

            if (cookieKey[0] === ' csr.sid' || cookieKey[0] === 'csr.sid') {
                // space is there after splitting so dont remove

                cookieCSRSessionId = 'csr.sid=' + cookieKey[1];
            }
        });

        if (!cookieCSRSessionId) {
            return Response.sendFailure(next, ResponseCodes.NO_TOKEN_USER_UNAUTHORIZED);
        }

        _.set(req.body, 'csrSessionId', cookieCSRSessionId);
        return next();
    }

    setCorsHeaders(req, res, next) {
        // Check if request is originating from a domain we want to allow
        let requestDomain = req.headers.origin;
        AllowedOrigins.forEach((allowedOrigin) => {
            if (requestDomain === allowedOrigin) {
                res.header('Access-Control-Allow-Origin', requestDomain);
            }
        });
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header(
            'Access-Control-Allow-Headers',
            'origin, sso_token, sso_token_enc,' +
            ' content-type, accept, authorization,' +
            ' authorization, cache-control, credentials,' +
            ' x-xsrf-token, x-csrf-token'
        );

        if (req.method === 'OPTIONS') {
            return res.send(200);
        }
        return next();
    }
}

module.exports = AuthController;
