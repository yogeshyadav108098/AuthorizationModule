'use strict';

const Path = require('path');
const Fs = require('graceful-fs');
const SwaggerJSDoc = require('swagger-jsdoc');
const Logger = require('../../lib/logger').getInstance();

const swaggerDefinition = {
    info: {
        title: 'Authorization Service Public APIs',
        version: '1.0.0',
        description: 'These APIs are to be consumed by clients: web, android and ios apps'
    },
    host: 'authorization.csr.com',
    basePath: '/papi'
};

const options = {
    swaggerDefinition: swaggerDefinition,
    apis: [Path.join(__dirname, '../../routes/*.js'), Path.join(__dirname, '../../routes/**/*.js')]
};

// initialize swagger-jsdoc
const swaggerSpec = new SwaggerJSDoc(options);

Fs.writeFile('./public/swagger/swagger.json', JSON.stringify(swaggerSpec, null, 4), function(err) {
    if (err) {
        Logger.error('Error Occured', err);
    } else {
        Logger.info('Created swagger docs');
    }
});
