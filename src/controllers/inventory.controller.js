'use strict'

const { SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {

    addStock = async (req, res, next) => {
        new SuccessResponse({
            message: 'addStock success',
            metaData: await InventoryService.addStockToInventory({
                ...req.body,
            })
        }).send(res)
    }

}

module.exports = new InventoryController()