'use strict'

const { Create, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {

    handleRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token success',
        //     metaData: await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res)

        // v2: fixed
        new SuccessResponse({
            message: 'Get token success',
            metaData: await AccessService.handleRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore,
            })
        }).send(res)

    }

    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logout Success',
            metaData: await AccessService.logOut(req.keyStore)
        }).send(res)
    }


    login = async (req, res, next) => {
        new SuccessResponse({
            message: 'Registed OK',
            metaData: await AccessService.login(req.body)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        new Create({
            message: 'Registed OK',
            metaData: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()