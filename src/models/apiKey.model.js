'use strict'

const { mongoose, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Apikey'
const COLLECTION_NAME = 'Apikeys'

// Declare the Schema of the Mongo model
var customSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, customSchema);
