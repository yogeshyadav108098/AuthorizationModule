'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

// create a schema
let userSchema = new Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    authUserId: {
        type: String,
        required: true,
        unique: true
    },
    roles: [
        {
            role: {
                type: Schema.Types.ObjectId,
                ref: 'Role'
            },
            entityType: {
                type: String,
                enum: ['NGO', 'ADMIN', 'COMPANY'],
                required: [true, 'Why there is no entity type?']
            },
            entityId: {
                type: String,
                required: [true, 'Why there is no entity Id?']
            }
        }
    ],
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    },
    createdBy: {
        type: String,
        default: ''
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

userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

let user = Mongoose.model('User', userSchema);

module.exports = user;
