'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, electronic, clothing, furniture } = require("../models/product.model")
const { findAllDraftsForShop, publishProductByShop, findAllPublishForShop, unpublishProductByShop, searchProductByUser, findAllProducts, findProduct, updateProductById } = require("../models/repositories/product.repo")
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils")
const { insertInventory } = require("../models/repositories/inventory.repo")
const NotificationService = require("./notification.service")

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

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productClass(payload).updateProduct(productId)
    }

    // PUT
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }
    static async unpublishProductByShop({ product_shop, product_id }) {
        return await unpublishProductByShop({ product_shop, product_id })
    }
    // END PUT

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }

        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }

        return await findAllPublishForShop({ query, limit, skip })
    }

    static async searchProductByUser({ keySearch }) {
        return await searchProductByUser({ keySearch })
    }

    static findAllProducts(options) {
        if (!options.limit) options.limit = 50
        if (!options.sort) options.sort = 'ctime'
        if (!options.page) options.page = 1
        if (!options.filter) options.filter = { isPublished: true }
        if (!options.select) options.select = ['product_name', 'product_price', 'product_thumb', 'product_shop']

        return findAllProducts(options)
    }

    static async findProduct({ product_id }) {
        return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] })
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
        const newProduct = await product.create({
            ...this,
            _id: product_id,
        })
        if (newProduct) {
            // add stock to inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            })

            // push noti to system
            NotificationService.pushNotiToSystem({
                type: 'SHOP-001',
                receivedId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop,
                }
            }).then(rs => console.log(rs))
                .catch(console.error)
        }

        return newProduct
    }

    async updateProduct(productId, bodyUpdate) {
        await updateProductById({ productId, bodyUpdate, model: product })
        return product.findById(productId);
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

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('create newProduct error')

        return newProduct
    }

    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {

            // update child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                model: clothing,
            })

        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))

        return updateProduct
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