'use strict'

const JWT = require('jsonwebtoken')
const asyncHandler = require('../helpers/assyncHanller')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const KeyTokenService = require('../services/keyToken.service')

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-rtoken-id',
}


const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // accessToken
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days',
        })

        // 

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.log('err', err);
            } else {
                console.log('decode verify::', decode);
            }
        })

        return { accessToken, refreshToken }

    } catch (error) {

    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /**
     * 1 - check userId missing
     * 2 - get accessToken
     * 3 - verify token
     * 4 - check user in database
     * 5 - check keystore with this userId
     * 6 - Ok all => return next()
     */

    const userId = req.headers[HEADER.CLIENT_ID]

    if (!userId) throw new AuthFailureError('Invalid request')

    //// 2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found key')

    ////3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        // console.log(userId , decodeUser.userId);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        req.user = decodeUser

        return next()
    } catch (error) {
        console.log('error111', error);
        throw error
    }

})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /**
     * 1 - check userId missing
     * 2 - get accessToken
     * 3 - verify token
     * 4 - check user in database
     * 5 - check keystore with this userId
     * 6 - Ok all => return next()
     */


    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')

    //// 2
    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not found key')

    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)

            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
            req.keyStore = keyStore
            req.refreshToken = refreshToken
            req.user = decodeUser

            return next()
        } catch (error) {
            console.log('error111', error);
            throw error
        }
    }

    ////3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        // console.log(userId , decodeUser.userId);
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        req.keyStore = keyStore
        req.user = decodeUser

        return next()
    } catch (error) {
        console.log('error111', error);
        throw error
    }

})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2,
}