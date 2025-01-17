'use strict'

const { mongoose, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// ORDER-001: order successfully
// ORDER-002: order failed
// PROMOTION-002: new promotion
// SHOP-001: new product bu User following

// Ban nhan duoc mot voucher cua Shop ABC
var createSchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001',], required: true },
    noti_senderId: { type: Types.ObjectId, required: true, red: 'Shop' },
    noti_receivedId: { type: Number, require: true, },
    noti_content: { type: String, require: true },
    noti_options: { type: Object, default: {} },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

module.exports = mongoose.model(DOCUMENT_NAME, createSchema)
