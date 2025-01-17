'use strict'

const { mongoose, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'


var orderSchema = new Schema({
    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    /**
     order_checkout = {
     totalPrice,
     totalApllyDiscount,
     feeShip
     }
     */

    order_shipping: { type: Object, default: {} },
    /**
     street,
     city,
     state,
     country,
     */

    order_payment: { type: Object, default: {} },
    order_product: { type: Array, require: true },
    order_trackingNumber: { type: String, default: '#000344340343' },
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' },

}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});


module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
