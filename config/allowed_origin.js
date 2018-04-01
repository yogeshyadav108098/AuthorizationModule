'use strict';

const Logger = require('../lib/logger').getInstance();

const originConfigs = {
    development: [
        'https://staging.csr.com'
    ],
    staging: [
        'https://staging.csr.com'
    ],
    production: [
        'https://csr.com'
    ]
};

let allowedOrigins = originConfigs[process.env.NODE_ENV || 'development'];
Logger.info('Loading Allowed Origins: ', JSON.stringify(allowedOrigins));
module.exports = allowedOrigins;
