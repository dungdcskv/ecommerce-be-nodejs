'use strict'


const express = require('express')
const asyncHandler = require('../../helpers/assyncHanller')
const { authenticationV2 } = require('../../auth/authUtils')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()

router.use(authenticationV2)

router.post('/', asyncHandler(cartController.addToCart))
router.delete('/', asyncHandler(cartController.deleteUserCart))
router.post('/update', asyncHandler(cartController.update))
router.get('/', asyncHandler(cartController.getListUserCart))


module.exports = router