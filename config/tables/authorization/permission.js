'use strict';

const permission = {

    NAME: 'Permission',
    COMMON_NAME: 'Permission',
    FILTERS: [
        'name'
    ],
    COLUMNS: [
        '_id',
        'name',
        'description',
        'createdBy',
        'status',
        'createdAt',
        'updatedAt'
    ],
    UPDATABLE_COLUMNS: [
        'status',
        'description',
        'createdBy'
    ],
    RESTRICTED_COLUMNS: {},
    PATTERN_MATCH_COLUMNS: [
        'name'
    ]
};

module.exports = permission;
