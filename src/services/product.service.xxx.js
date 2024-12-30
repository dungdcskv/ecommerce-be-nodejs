'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, electronic, clothing, furniture } = require("../models/product.model")
const { findAllDraftsForShop } = require("../models/repositories/product.repo")

// define Factory class to create product
class ProductFactory {
    /**
     * type: clothing
     * payload
     */

    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productClass(payload).createProduct()
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        console.log('product_shoppppppppppppppp', product_shop);
        

        return await findAllDraftsForShop({ query, limit, skip })
    }
}

// define base product class
class Product {
    constructor({
        product_name,
        product_thump,
        product_type,
        product_price,
        product_quantity,
        product_attributes,
        product_description,
        product_shop,
    }) {
        this.product_name = product_name
        this.product_thump = product_thump
        this.product_type = product_type
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_attributes = product_attributes
        this.product_description = product_description
        this.product_shop = product_shop
    }

    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id,
        })
    }
}



// define sub-class for different product types Clothing
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newClothing) throw new BadRequestError('create newClothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create newProduct error')

        return newProduct
    }
}

// define sub-class for different product types Clothing
class Electronics extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newElectronic) throw new BadRequestError('create newElectronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('create newProduct error')

        return newProduct
    }
}

class Furniture extends Product {

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        })
        if (!newFurniture) throw new BadRequestError('create newFurniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('create newProduct error')

        return newProduct
    }
}

// register product type
ProductFactory.registerProductType('Electronics', Electronics)
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory