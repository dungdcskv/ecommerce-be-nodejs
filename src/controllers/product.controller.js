'use strict'

const { Create, SuccessResponse } = require("../core/success.response");
const { product } = require("../models/product.model");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new product success',
            metaData: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    // QUERY
    /**
     * get all drafts for shop
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    getAllDraftShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list Draft success',
            metaData: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }
    // END QUERY
}

module.exports = new ProductController()