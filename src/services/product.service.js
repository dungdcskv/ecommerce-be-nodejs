'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, electronic, clothing } = require("../models/product.model")

// define Factory class to create product
class ProductFactory {
    /**
     * type: clothing
     * payload
     */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronics(payload)

            case 'Clothing':
                return new Clothing(payload)

            default:
                throw new BadRequestError(`Invalid Product Type ${type}`)
        }
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

    async createProduct() {
        return await product.create(this)
    }
}



// define sub-class for different product types Clothing
class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('create newClothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create newProduct error')

        return newProduct
    }
}

// define sub-class for different product types Clothing
class Electronics extends Product {

    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError('create newElectronic error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('create newProduct error')

        return newProduct
    }
}


module.exports = ProductFactory