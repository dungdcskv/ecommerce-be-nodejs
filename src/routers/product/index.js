'use strict'


const express = require('express')
const productController = require('../../controllers/product.controller')
const asyncHandler = require('../../helpers/assyncHanller')
const { authentication, authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()


// router.use(authentication)
router.use(authenticationV2)

router.post('', asyncHandler(productController.createProduct))

// QUERY
router.get('/drafts/all', asyncHandler(productController.getAllDraftShop))

module.exports = router