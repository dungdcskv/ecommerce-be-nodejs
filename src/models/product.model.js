'use strict'

const { Schema, Types, model } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

// Declare the Schema of the Mongo model
var customSchema = new Schema({
    product_name: { type: String, require: true },
    product_thump: { type: String, require: true },
    product_type: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_attributes: { type: Schema.Types.Mixed, require: true },

    product_description: { type: Types.ObjectId, ref: 'Shop' },
    product_shop: String,
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});




// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
}, {
    timestamps: true,
    collection: 'clothes',
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
}, {
    timestamps: true,
    collection: 'electronic',
})


//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, customSchema),
    electronic: model('electronic', electronicSchema),
    clothing: model('clothes', clothingSchema),
}
