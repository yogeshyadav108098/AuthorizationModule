"use strict";

var Util = require('util');
var Mongoose = require('mongoose');

function configure(config) {
    var dbConfig = {
        url: Util.format('mongodb://%s:%s@%s:%s/%s',
            encodeURIComponent(config.user),
            encodeURIComponent(config.password),
            config.host,
            (config.port || 27017),
            config.database),
        server_options: {
            server: {
                poolSize: config.poolsize
            }
        }
    };

    var db = Mongoose(dbConfig.url, dbConfig.server_options);

    return db;
}


module.exports = configure;