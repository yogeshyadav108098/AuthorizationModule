'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// create a schema
let permissionSchema = new Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: [true, 'Why there is no name for permission?'],
        unique: true
    },
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

permissionSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

let permission = Mongoose.model('Permission', permissionSchema);

module.exports = permission;
