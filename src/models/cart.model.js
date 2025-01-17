'use strict'

const { mongoose, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'Carts'


var cartSchema = new Schema({
    cart_state: {
        type: String,
        required: true,
        enum: ['active', 'completed', 'pending', 'failed'],
        default: 'active'
    },
    cart_products: {
        type: Array,
        required: true,
        default: [],
    },
    /**
     [{productId, shopId, quantity, name, price}]
     */
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, require: true, }

}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});


module.exports = {
    cart: mongoose.model(DOCUMENT_NAME, cartSchema),
};
