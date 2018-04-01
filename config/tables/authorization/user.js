'use strict';

const user = {

    NAME: 'User',
    COMMON_NAME: 'User',
    FILTERS: [
        'authUserId'
    ],
    COLUMNS: [
        '_id',
        'authUserId',
        'roles',
        'createdBy',
        'status',
        'createdAt',
        'updatedAt'
    ],
    UPDATABLE_COLUMNS: [
        'roles',
        'status',
        'createdBy'
    ],
    RESTRICTED_COLUMNS: {},
    PATTERN_MATCH_COLUMNS: [
        'authUserId'
    ]
};

module.exports = user;
