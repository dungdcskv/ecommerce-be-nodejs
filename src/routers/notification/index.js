'use strict'


const express = require('express')
const asyncHandler = require('../../helpers/assyncHanller')
const { authenticationV2 } = require('../../auth/authUtils')
const notificationController = require('../../controllers/notification.controller')
const router = express.Router()

// here not login

router.use(authenticationV2)

/// logined
router.get('', asyncHandler(notificationController.listNotiByUser))


module.exports = router