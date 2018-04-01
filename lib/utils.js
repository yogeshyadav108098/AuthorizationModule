'use strict';

const Logger = require('./logger').getInstance();

class Utils {
    constructor() {
        Logger.info('Constructing Lib Utilities');
        return;
    }

    bind(object, func) {
        return object[func].bind(object);
    }

    genError(message, status, code) {
        let error = new Error(message || 'Unexpected error occurred, Please report');
        error.status = status ? status : 500;
        error.code = code;
        return error;
    }

    randomGenerate(min, max) {
        return Math.floor(Math.random() * ((max - 1) - min + 1)) + min;
    }
}

let utilsInstance;
module.exports.getInstance = function() {
    if (!utilsInstance) {
        utilsInstance = new Utils();
    }

    return utilsInstance;
};
