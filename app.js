'use strict';

const _ = require('lodash');
const Yargs = require('yargs');
const Morgan = require('morgan');
const Express = require('express');
const BodyParser = require('body-parser');

let Argv = Yargs.usage('Usage: $0 [options]')
    .example('$0 -p 1308 -e development', 'Start the service')
    .alias('p', 'PORT')
    .nargs('p', 1)
    .describe('p', 'Port to run')
    .demandOption(['p'])
    .alias('e', 'NODE_ENV')
    .nargs('e', 1)
    .describe('e', 'Node Environment')
    .demandOption(['e'])
    .alias('l', 'LOG_PATH')
    .nargs('l', 1)
    .describe('l', 'Log Path')
    .demandOption(['l'])
    .help('h')
    .alias('h', 'help')
    .epilog('copyright 2018')
    .argv;

// Set environment variables to App
_.set(process.env, 'PORT', Argv.PORT);
_.set(process.env, 'NODE_ENV', Argv.NODE_ENV);
_.set(process.env, 'LOG_PATH', Argv.LOG_PATH);

// Internal
const Logger = require('./lib/logger');
const ServiceConfig = require('./config/service');
const ThreadStorageHelpers = require('./helpers/thread_storage');

let Controller = require('./controller');

// Initialize Express App
let App = Express();
App.use(BodyParser.json({
    limit: '10mb'
}));
App.use(BodyParser.urlencoded({
    extended: true, // will select basic querystring module to encode/decode over qs which isnt supported by all browsers
    limit: '10mb',
    parameterLimit: '5000'
}));

// Set environment variables to App
_.set(App, 'PORT', process.env.PORT || ServiceConfig.PORT);
_.set(App, 'NODE_ENV', process.env.NODE_ENV || ServiceConfig.NODE_ENV);


//Set All static files path
App.use(Express.static('apiDocs'));

// Add Request Id for every request to thread storage
App.use(ThreadStorageHelpers.addRequestId);

// Route log with basic info
Morgan.token('user', (req, res) => {
    let userinfo = req.ip;
    return userinfo;
});
App.use(Morgan(":method :url :status :res[Content-Length] :response-time ms :user", {
    stream: Logger.stream()
}));

// Create controller Object
let controller_options = {};
let ControllerObject = new Controller(controller_options);

// Expose Routes
require('./routes')(App, ControllerObject);

// Run the service
App.listen(_.get(App, 'PORT'), () => {
    Logger.info(`Successfully listening to port ${_.get(App, 'PORT')} and running in ${_.get(App, 'NODE_ENV')} mode`);
});