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

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'updateProduct success',
            metaData: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'publishProductByShop success',
            metaData: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    unpublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'unpublishProductByShop success',
            metaData: await ProductServiceV2.unpublishProductByShop({
                product_id: req.params.id,
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

    searchProductByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'searchProductByUser success',
            metaData: await ProductServiceV2.searchProductByUser(req.params)
        }).send(res)
    }

    getAllPublishShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list publish success',
            metaData: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId,
            })
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'findAllProducts success',
            metaData: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'findProduct success',
            metaData: await ProductServiceV2.findProduct(req.params)
        }).send(res)
    }


    // END QUERY


}

module.exports = new ProductController()