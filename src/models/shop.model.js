'use strict'

const { mongoose, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'


var shopSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        // unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        emum: ['active', 'inactive'],
        default: 'inactive'
    },
    verify: {
        type: mongoose.Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array,
        default: [],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});


module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
