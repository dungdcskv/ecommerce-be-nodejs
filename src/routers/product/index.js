'use strict'


const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/assyncHanller')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.get('/search/:keySearch', asyncHandler(productController.searchProductByUser))
router.get('/', asyncHandler(productController.findAllProducts))
router.get('/:product_id', asyncHandler(productController.findProduct))

// router.use(authentication)
router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unpublishProductByShop))

// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftShop))
router.get('/publish/all', asyncHandler(productController.getAllPublishShop))

module.exports = router