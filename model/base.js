'use strict';

const Q = require('q');
const _ = require('lodash');
const Util = require('util');
const Logger = require('../lib/logger').getInstance();
const LibUtils = require('../lib/utils').getInstance();
const ResponseCodes = require('../helpers/response_code');

const sortMap = {
    ASCENDING: 1,
    DESCENDING: -1
};

const filePrefix = 'Base Model:';

function pass() {
    return;
}

class Model {
    constructor(options) {
        let functionPrefix = 'Constructor:';
        Logger.info(filePrefix, functionPrefix, 'Options', JSON.stringify(Util.inspect(options)));
        if (!_.isObject(options)) {
            Logger.error(filePrefix, functionPrefix, 'Options are not in object format', options);
            return LibUtils.genError(
                'Options are not available for constructing table schema',
                ResponseCodes.UNABLE_TO_PROCESS.status,
                ResponseCodes.UNABLE_TO_PROCESS.code
            );
        }

        let table = _.get(options, 'table');

        if (!_.isObject(table)) {
            Logger.error(filePrefix, functionPrefix, 'Table is not in object format', table);
            return LibUtils.genError(
                'Table is not in proper format for constructing table schema',
                ResponseCodes.UNABLE_TO_PROCESS.status,
                ResponseCodes.UNABLE_TO_PROCESS.code
            );
        }

        this._modelName = table.NAME;
        this._columns = table.COLUMNS;
        this._updatableColumns = table.UPDATABLE_COLUMNS;
        this._model = options.model;
    }

    exec(options) {
        let functionPrefix = 'Exec:';
        let query = options.query;
        Logger.debug(filePrefix, functionPrefix, JSON.stringify(Util.inspect(query)));
        return query.exec();
    }

    getselectFields(options) {
        let functionPrefix = 'Get Select Fields:';
        let self = this;
        let fields;

        Logger.debug(filePrefix, functionPrefix, 'Process columns ', _.get(options, 'columns'));
        if (_.get(options, 'columns.include')) {
            Logger.debug(filePrefix, functionPrefix, 'Including columns', _.get(options, 'columns.include'));
            fields = [];

            if (!_.isArray(options.columns.include)) {
                options.columns.include = options.columns.include.split(',');
            }
            options.columns.include.forEach(function(column) {
                if (self._columns.contains(column)) {
                    fields.push(column);
                }
            });
            Logger.debug(filePrefix, functionPrefix, 'After including columns fields', fields);
        }

        if (_.get(options, 'columns.exclude')) {
            Logger.debug(filePrefix, functionPrefix, 'Excluding columns', _.get(options, 'columns.exclude'));
            fields = [];

            if (!_.isArray(options.columns.exclude)) {
                options.columns.exclude = options.columns.exclude.split(',');
            }
            options.columns.exclude.forEach(function(column) {
                if (self._columns.contains(column)) {
                    fields.push('-' + column);
                }
            });
            Logger.debug(filePrefix, functionPrefix, 'After excluding columns fields', fields);
        }

        fields ? (fields = fields.join(' ')) : pass(); // jshint ignore:line
        Logger.debug(filePrefix, functionPrefix, 'After including and excluding columns fields', fields);
        return fields;
    }

    prepareFilters(options) {
        let functionPrefix = 'Prepare Filters:';
        let filters;

        Logger.debug(filePrefix, functionPrefix, 'Preparing filters from', options.filters);
        if (options.filters && typeof options.filters === 'object') {
            filters = {};
            for (let filterColumn in Object.keys(options.filters)) {
                Logger.debug(filePrefix, functionPrefix, 'Processing', filterColumn, options.filters[filterColumn]);
                if (
                    _.isString(typeof options.filters[filterColumn]) ||
                    _.isNumber(typeof options.filters[filterColumn])
                ) {
                    // filter based on single value
                    Logger.debug(filePrefix, functionPrefix, 'Identified as single value filter');
                    filters[filterColumn] = options.filters[filterColumn];
                } else if (_.isArray(options.filters[filterColumn])) {
                    // filter based on array of values
                    Logger.debug(filePrefix, functionPrefix, 'Identified as array of value value filter');
                    filters[filterColumn] = {
                        $in: options.filters[filterColumn]
                    };
                } else if (
                    _.isObject(options.filters[filterColumn]) &&
                    ['in', 'notIn', 'all', 'or', 'nor', 'gt', 'gte', 'lt', 'lte', 'ne'].indexOf(
                        options.filters[filterColumn].operator
                    ) !== -1
                ) {
                    // operators
                    Logger.debug(
                        filePrefix,
                        functionPrefix,
                        'Identified as one of operators (in,notIn,all,or,nor,gt,gte,lt,lte,ne) filter'
                    );
                    filters[filterColumn] = {};
                    filters[filterColumn]['$' + options.filters[filterColumn].operator] =
                        options.filters[filterColumn].value;
                } else if (
                    _.isObject(options.filters[filterColumn]) &&
                    options.filters[filterColumn].from &&
                    options.filters[filterColumn].to &&
                    options.filters[filterColumn].operator === 'between'
                ) {
                    // filter based on range of values (from:to)
                    Logger.debug(filePrefix, functionPrefix, 'Identified as between operator');
                    filters[filterColumn] = {
                        $gte: options.filters[filterColumn].from,
                        $lte: options.filters[filterColumn].to
                    };
                } else if (
                    _.isObject(options.filters[filterColumn]) &&
                    ['size', 'slice'].indexOf(options.filters[filterColumn].operator) !== -1
                ) {
                    // Aggregations
                    Logger.debug(filePrefix, functionPrefix, 'Identified as one of operators (size, slice) filter');
                    filters[filterColumn] = {};
                    filters[filterColumn]['$' + options.filters[filterColumn].operator] =
                        options.filters[filterColumn].value;
                } else if (['patternMatch'].indexOf(filterColumn) !== -1 && options.filters[filterColumn]) {
                    // Pattern Match
                    Logger.debug(filePrefix, functionPrefix, 'Identified as pattern match filter');
                    Object.keys(options.filters[filterColumn]).forEach(function(field) {
                        filters[field] = new RegExp(options.filters[filterColumn][field], 'i');
                    });
                }
            }
        }

        Logger.debug(filePrefix, functionPrefix, 'Prepared filters', filters);
        return filters;
    }

    getOrderFields(options) {
        let functionPrefix = 'Get Order Fields:';
        let self = this;
        let fields;
        Logger.debug(filePrefix, functionPrefix, 'Preparing order by fields from', options.orderBy);
        if (options.orderBy && typeof options.orderBy === 'object') {
            fields = {};
            for (let orderColumn in Object.keys(options.orderBy)) {
                Logger.debug(
                    filePrefix,
                    functionPrefix,
                    'Applying order column',
                    orderColumn,
                    options.orderBy[orderColumn]
                );
                if (_.contains(self._columns, orderColumn)) {
                    fields[orderColumn] = sortMap[options.orderBy[orderColumn]];
                }
            }
        }

        Logger.debug(filePrefix, functionPrefix, 'Prepared order by fields', options);
        return fields;
    }

    applyExistFields(options, query) {
        let functionPrefix = 'Apply Exist Fields:';
        let existFields = options.existFields;
        if (!existFields) {
            return;
        }

        if (!_.isArray(existFields)) {
            existFields = [existFields];
        }

        if (!existFields.length) {
            return;
        }
        existFields.forEach(function(field) {
            Logger.debug(filePrefix, functionPrefix, '(key, value)', field);
            query.exists(field.key, field.value);
        });
    }

    list(options) {
        let functionPrefix = 'List:';
        let self = this;
        let selectFields;
        let filters;
        let orderFields;
        let query;

        // Create search query
        query = self._model.find();

        selectFields = self.getselectFields(options);
        filters = self.prepareFilters(options);
        orderFields = self.getOrderFields(options);

        // Add columns if asked by user
        Logger.debug(filePrefix, functionPrefix, 'Applying select fields', selectFields);
        selectFields ? query.select(selectFields) : pass(); // jshint ignore:line

        // Add filters
        Logger.debug(filePrefix, functionPrefix, 'Applying filters', filters);
        filters ? query.find(filters) : pass(); // jshint ignore:line

        // Add order fields
        Logger.debug(filePrefix, functionPrefix, 'Applying order fields', orderFields);
        orderFields ? query.sort(orderFields) : pass(); // jshint ignore:line

        // Apply limit
        Logger.debug(filePrefix, functionPrefix, 'Applying limit', options.limit);
        (options.limit && Number(options.limit)) ? query.limit(options.limit) : pass(); // jshint ignore:line

        // Apply offset
        Logger.debug(filePrefix, functionPrefix, 'Applying offset', options.offset);
        (options.offset && Number(options.offset)) ? query.skip(options.offset) : pass(); // jshint ignore:line

        // Apply count
        Logger.debug(filePrefix, functionPrefix, 'Applying count', options.count);
        (options.count && Number(options.count)) ? query.count() : pass(); // jshint ignore:line

        // Apply distinct field
        Logger.debug(filePrefix, functionPrefix, 'Applying distinct', options.distinct);
        options.distinct ? query.distinct(options.distinct) : pass(); // jshint ignore:line

        // Apply tailable : will return results in insert order
        Logger.debug(filePrefix, functionPrefix, 'Applying tailable', options.tailable);
        options.tailable ? query.tailable(options.tailable) : pass(); // jshint ignore:line

        // Check exists fields
        Logger.debug(filePrefix, functionPrefix, 'Applying exist fields', options.existFields);
        self.applyExistFields(options, query);

        return self.exec({
            query
        });
    }

    stream(options) {
        let functionPrefix = 'Stream:';
        let self = this;
        let selectFields;
        let filters;
        let orderFields;
        let query;

        // Create search query
        query = self._model.find();

        selectFields = self.getselectFields(options);
        filters = self.prepareFilters(options);
        orderFields = self.getOrderFields(options);

        // Add columns if asked by user
        Logger.debug(filePrefix, functionPrefix, 'Applying select fields', selectFields);
        selectFields ? query.select(selectFields) : pass(); // jshint ignore:line

        // Add filters
        Logger.debug(filePrefix, functionPrefix, 'Applying filters', filters);
        filters ? query.find(filters) : pass(); // jshint ignore:line

        // Add order fields
        Logger.debug(filePrefix, functionPrefix, 'Applying order fields', orderFields);
        orderFields ? query.sort(orderFields) : pass(); // jshint ignore:line

        return query.stream();
    }

    insert(options) {
        let functionPrefix = 'Insert:';
        let self = this;

        Logger.debug(filePrefix, functionPrefix, 'Inserting with options', JSON.stringify(options));

        if (!_.isObject(options)) {
            Logger.error(filePrefix, functionPrefix, 'Invalid create object', JSON.stringify(options));
            return Q.reject(
                LibUtils.genError(
                    'Invalid create object',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        let query = self._model.create(options);
        return self.exec({
            query
        });
    }

    update(options) {
        let functionPrefix = 'Update:';
        let self = this;

        Logger.debug(filePrefix, functionPrefix, 'Updating with options', JSON.stringify(options));

        if (!_.isObject(options)) {
            Logger.error(filePrefix, functionPrefix, 'Invalid update object', JSON.stringify(options));
            return Q.reject(
                LibUtils.genError(
                    'Invalid update object',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }


        let id = _.get(options, 'id');
        if (!id) {
            Logger.error(filePrefix, functionPrefix, 'No Id to update', JSON.stringify(options));
            return Q.reject(
                LibUtils.genError(
                    'No id to update',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        let filters = {
            id: id
        };
        let fields = {};

        let fieldsToUodate = _.get(options, 'fields');
        for (let column in fieldsToUodate) {
            if (this._updatableColumns.indexOf(column) === -1) {
                return Q.reject(
                    LibUtils.genError(
                        'Cannot update column:' + column,
                        ResponseCodes.UNABLE_TO_PROCESS.status,
                        ResponseCodes.UNABLE_TO_PROCESS.code
                    )
                );
            } else {
                fields[column] = fieldsToUodate[column];
            }
        }

        Logger.debug(filePrefix, functionPrefix, 'Filters:', JSON.stringify(filters), 'Fields', JSON.stringify(fields));
        if (!_.isObject(filters) || !_.isObject(fields)) {
            Logger.error(
                filePrefix,
                functionPrefix,
                'Invalid update object without filters or fields',
                'Filters:',
                JSON.stringify(filters),
                'Fields:',
                JSON.stringify(fields)
            );
            return Q.reject(
                LibUtils.genError(
                    'Invalid update object without filters or fields',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        Logger.debug(filePrefix, functionPrefix, 'Creating query with upsert set as false and multi set as true');
        let query = this._model.update(filters, fields, {
            upsert: false,
            multi: true
        });

        return self.exec({
            query
        });
    }

    bulkUpdate(options) {
        let functionPrefix = 'Bulk Update:';
        let self = this;

        Logger.debug(filePrefix, functionPrefix, 'Updating with options', JSON.stringify(options));

        if (!_.isObject(options)) {
            Logger.error(filePrefix, functionPrefix, 'Invalid update object', JSON.stringify(options));
            return Q.reject(
                LibUtils.genError(
                    'Invalid update object',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        let filters = _.get(options, 'filters');

        let fields = {};
        let fieldsToUodate = _.get(options, 'fields');
        for (let column in fieldsToUodate) {
            if (this._updatableColumns.indexOf(column) === -1) {
                return Q.reject(
                    LibUtils.genError(
                        'Cannot update column:' + column,
                        ResponseCodes.UNABLE_TO_PROCESS.status,
                        ResponseCodes.UNABLE_TO_PROCESS.code
                    )
                );
            } else {
                fields[column] = fieldsToUodate[column];
            }
        }

        Logger.debug(filePrefix, functionPrefix, 'Filters:', JSON.stringify(filters), 'Fields', JSON.stringify(fields));
        if (!_.isObject(filters) || !_.isObject(fields)) {
            Logger.error(
                filePrefix,
                functionPrefix,
                'Invalid update object without filters or fields',
                'Filters:',
                JSON.stringify(filters),
                'Fields:',
                JSON.stringify(fields)
            );
            return Q.reject(
                LibUtils.genError(
                    'Invalid update object without filters or fields',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        Logger.debug(filePrefix, functionPrefix, 'Creating query with upsert set as false and multi set as true');
        let query = this._model.update(filters, fields, {
            upsert: false,
            multi: true
        });

        return self.exec({
            query
        });
    }

    delete(options) {
        let functionPrefix = 'Update:';
        let self = this;

        Logger.debug(filePrefix, functionPrefix, 'Deleting with options', JSON.stringify(options));

        if (!_.isObject(options)) {
            Logger.error(filePrefix, functionPrefix, 'Invalid delete object', JSON.stringify(options));
            return Q.reject(
                LibUtils.genError(
                    'Invalid delete object',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        if (!options.id) {
            Logger.error(filePrefix, functionPrefix, 'Can not delete entry without ID');
            return Q.reject(
                LibUtils.genError(
                    'Can not delete entry without ID',
                    ResponseCodes.PRECONDITION_FAILED.status,
                    ResponseCodes.PRECONDITION_FAILED.code
                )
            );
        }

        let query = this._model.findByIdAndRemove(options.id);
        return self.exec({
            query
        });
    }

    softDelete(options) {
        let functionPrefix = 'Soft Delete:';
        let self = this;

        Logger.debug(filePrefix, functionPrefix, 'Deleting with options', JSON.stringify(options));

        if (!_.isObject(options)) {
            Logger.error(filePrefix, functionPrefix, 'Invalid delete object', JSON.stringify(options));
            return Q.reject(
                LibUtils.genError(
                    'Invalid delete object',
                    ResponseCodes.UNABLE_TO_PROCESS.status,
                    ResponseCodes.UNABLE_TO_PROCESS.code
                )
            );
        }

        if (!options.id) {
            Logger.error(filePrefix, functionPrefix, 'Can not delete entry without ID');
            return Q.reject(
                LibUtils.genError(
                    'Can not delete entry without ID',
                    ResponseCodes.PRECONDITION_FAILED.status,
                    ResponseCodes.PRECONDITION_FAILED.code
                )
            );
        }

        let filters = {
            id: options.id
        };
        let fields = {
            status: Enums.status.INACTIVE
        };

        let query = this._model.update(filters, fields, {
            upsert: false,
            multi: true
        });

        return self.exec({
            query
        });
    }
}

module.exports = Model;
