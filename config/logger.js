'use strict';

module.exports = {
    CONSOLE: {
        NAME: 'Console',
        LOG_LEVEL: 'debug'
    },

    FILE: {
        JSON: {
            NAME: 'AuthorizationService-JSONLogger',
            FILE_NAME: 'AuthorizationService-json.log',
            LOG_LEVEL: 'debug'
        },
        PRETTY: {
            NAME: 'AuthorizationService-PrettyLogger',
            FILE_NAME: 'AuthorizationService-pretty.log',
            LOG_LEVEL: 'debug'
        }
    }
};
