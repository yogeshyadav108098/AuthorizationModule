'use strict';

const role = {

    NAME: 'Role',
    COMMON_NAME: 'Role',
    FILTERS: [
        'name'
    ],
    COLUMNS: [
        '_id',
        'name',
        'permissions',
        'description',
        'createdBy',
        'status',
        'createdAt',
        'updatedAt'
    ],
    UPDATABLE_COLUMNS: [
        'permissions',
        'status',
        'createdBy',
        'description'
    ],
    RESTRICTED_COLUMNS: {},
    PATTERN_MATCH_COLUMNS: [
        'name'
    ]
};

module.exports = role;
