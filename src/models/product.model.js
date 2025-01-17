'use strict'

const { Schema, Types, model } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'


var productSchema = new Schema({
    product_name: { type: String, require: true },
    product_thump: { type: String, require: true },
    product_type: { type: String, require: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_price: { type: Number, require: true },
    product_quantity: { type: Number, require: true },
    product_attributes: { type: Schema.Types.Mixed, require: true },

    product_description: String,
    product_slug: String, // quan-jean-cao-cap
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        // 4.3456 => 4.3
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// create index for search
productSchema.index({ product_name: 'text', product_description: 'text' })


// document middleware: runs before .save() and .create()...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


// define the product type = clothing
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'clothes',
})

// define the product type = electronic
const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'electronic',
})


const furnitureSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Types.ObjectId, ref: 'Shop' },
}, {
    timestamps: true,
    collection: 'furniture',
})



module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('electronic', electronicSchema),
    clothing: model('clothes', clothingSchema),
    furniture: model('furniture', furnitureSchema),
}
