'use strict'

const { mongoose, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'


var inventorySchema = new Schema({
    inven_productId: { type: Types.ObjectId, ref: 'Product' },
    inven_shopId: { type: Types.ObjectId, ref: 'Shop' },
    inven_location: { type: String, default: 'unKnow' },
    inven_stock: { type: Number, require: true },
    inven_reservations: { type: Array, default: [] }, // cartId, stock, creation

}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});


module.exports = {
    inventory: mongoose.model(DOCUMENT_NAME, inventorySchema),
};
