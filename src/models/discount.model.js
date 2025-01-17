'use strict'

const { mongoose, Schema, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'Discounts'


var shopSchema = new Schema({
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_code: { type: String, required: true },
    discount_type: { type: String, default: 'fixed_amount' }, // percentage
    discount_value: { type: Number, require: true, },
    discount_start_date: { type: Date, require: true, },
    discount_end_date: { type: Date, require: true, },
    discount_max_uses: { type: Number, require: true, }, // so luong discount duoc ap dung
    discount_max_value: { type: Number, require: true, },
    discount_uses_count: { type: Number, require: true, }, // so discount da su dung
    discount_uses_used: { type: Array, default: [], }, // ai da su dung
    discount_max_uses_per_user: { type: Number, require: true, }, // so luong toi da cho phep su dung
    discount_min_order_value: { type: Number, require: true, }, // 
    discount_shopId: { type: Types.ObjectId, ref: 'Shop' }, // 

    discount_is_active: { type: Boolean, default: true }, // 
    discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] }, //
    discount_product_ids: { type: Array, default: [] } // so sp duoc ap dung 
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});


module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
