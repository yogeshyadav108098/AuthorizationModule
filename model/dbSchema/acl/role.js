'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// create a schema
let roleSchema = new Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'Why there is no name for role?'],
        unique: true
    },
    permissions: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Permission'
        }
    ],
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

roleSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

let role = Mongoose.model('Role', roleSchema);

module.exports = role;
