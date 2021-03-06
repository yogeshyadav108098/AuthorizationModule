'use strict';

module.exports = function(app, controllerObject) {
    // Add ACL Routes
    require('./acl')(app, controllerObject);

    // Add Common Routes
    require('./common')(app, controllerObject);
};
