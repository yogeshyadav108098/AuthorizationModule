'use strict';

const Q = require('q'); // jshint ignore:line
const Util = require('util');
const Mongoose = require('mongoose');

Mongoose.Promise = Q;

function configure(config) {
    let dbConfig = {
        connectionURL: Util.format(
            'mongodb://%s:%s@%s:%s/%s',
            encodeURIComponent(config.user),
            encodeURIComponent(config.password),
            config.host,
            config.port || 27017,
            config.database
        ),
        serverOptions: {
            server: {
                poolSize: config.poolsize
            }
            // promiseLibrary: Q
        }
    };

    return Mongoose.connect(dbConfig.connectionURL, dbConfig.serverOptions);
}

module.exports = configure;
