'use strict';

let HostConfigs = {
    development: {
    },
    staging: {
    },
    production: {
    }
};

let Endpoints = {
    HOST: HostConfigs[process.env.NODE_ENV || 'development'],
    ROUTES: {

    },
    ROUTES_CONFIG: {

    }
};

module.exports = Endpoints;
