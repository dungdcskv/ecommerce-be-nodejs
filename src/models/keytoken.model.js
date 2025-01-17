'use strict'

const { Schema, model, mongoose } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


var keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop',
    },
    privateKey: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
    refreshTokensUsed: {
        type: Array,
        default: [], // những RT đã được sử dụng
    },
    refreshToken: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});


module.exports = model(DOCUMENT_NAME, keyTokenSchema);
