'use strict'

const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {

    addToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'addToCart success',
            metaData: await CartService.addToCart({
                ...req.body,
            })
        }).send(res)
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'updateUserCartQuantity success',
            metaData: await CartService.addToCartV2({
                ...req.body,
            })
        }).send(res)
    }

    deleteUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'deleteUserCart success',
            metaData: await CartService.deleteUserCart({
                ...req.body,
            })
        }).send(res)
    }

    getListUserCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'getListUserCart success',
            metaData: await CartService.getListUserCart({
                ...req.query,
            })
        }).send(res)
    }



}

module.exports = new CartController()