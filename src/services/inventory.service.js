'use strict'

const { BadRequestError } = require("../core/error.response")
const { inventory } = require("../models/inventory.model")
const { getProductById } = require("../models/repositories/product.repo")


class InventoryService {

    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = '134, Tran Phu, HCM city',
    }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError('The product does not exists')

        const query = { inven_shopId, iven_productId: productId },
            updateSet = {
                $inc: {
                    inven_location: location,
                },
                $set: {
                    inven_location: location,
                }
            },
            options = { upsert: true, new: true }

        return await inventory.updateOne(query, updateSet)
    }

}

module.exports = InventoryService