'use strict'

const { SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'createDiscountCode success',
            metaData: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId,
            })
        }).send(res)

    }

    getAllDiscountCodeByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'getAllDiscountCodeByShop success',
            metaData: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId: req.user.userId,
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'getDiscountAmount success',
            metaData: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'getAllDiscountCodesWithProduct success',
            metaData: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }

}

module.exports = new DiscountController()