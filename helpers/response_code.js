'use strict';

module.exports = {

    // 2XX
    OK: {
        code: 'OK',
        status: 200,
        message: 'Processed'
    },
    CREATED: {
        code: 'CREATED',
        status: 201,
        message: 'Requested resource created'
    },
    ACCEPTED: {
        code: 'ACCEPTED',
        status: 202,
        message: 'Accepted for processing'
    },
    NO_CONTENT: {
        code: 'NO_CONTENT',
        status: 204,
        message: 'Processed the request but no content for returning'
    },

    // 4XX
    INVALID_EMAIL: {
        code: 'INVALID_EMAIL',
        status: 400,
        message: 'Invalid email'
    },
    INVALID_JSON_CONTENT: {
        code: 'INVALID_JSON_CONTENT',
        status: 400,
        message: 'Invalid Json content'
    },

    NO_USER: {
        code: 'NO_USER',
        status: 401,
        message: 'No such user exists'
    },
    USER_BLOCKED: {
        code: 'USER_BLOCKED',
        status: 401,
        message: 'User is blocked at oauth'
    },
    USER_UNAUTHORIZED: {
        code: 'USER_UNAUTHORIZED',
        status: 401,
        message: 'User is not authorized'
    },

    ROLE_NOT_FOUND: {
        code: 'ROLE_NOT_FOUND',
        status: 404,
        message: 'Requested role does not exist'
    },
    PERMISSION_NOT_FOUND: {
        code: 'PERMISSION_NOT_FOUND',
        status: 404,
        message: 'Requested permission does not exist'
    },
    ASSOCIATION_NOT_FOUND: {
        code: 'ASSOCIATION_NOT_FOUND',
        status: 404,
        message: 'Requested association does not exist'
    },

    CONFLICT: {
        code: 'CONFLICT',
        status: 409,
        message: 'Requested resource already exists'
    },

    PRECONDITION_FAILED: {
        code: 'PRECONDITION_FAILED',
        status: 412,
        message: 'Mandatory parameters missing'
    },

    UNABLE_TO_PROCESS: {
        code: 'UNABLE_TO_PROCESS',
        status: 422,
        message: 'UNABLE_TO_PROCESS'
    },

    TRANSACTION_FAILED: {
        code: 'TRANSACTION_FAILED',
        status: 500,
        message: 'Transaction failed'
    },

    custom: function (message, status, code) {

        let response = {
            status: status || 500,
            message: message,
            code: code
        };
        return response;
    }
};