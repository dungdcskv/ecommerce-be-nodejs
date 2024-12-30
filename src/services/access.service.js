'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair, verifyJWT } = require("../auth/authUtils")
const { getIntoData } = require("../utils")
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN',
}

class AccessService {

    /**
 * check this token used?
 * 
 */
    static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {

        const { userId, email } = user

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            // xoa tat ca token trong keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Some thing wrong happend. Please relogin')
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new AuthFailureError('Shop not register')
        }

        // check userId
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not register')

        // create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        // update token
        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
            }
        })

        return {
            user,
            tokens
        }
    }

    /**
     * check this token used?
     * 
     */
    static handleRefreshToken = async (refreshToken) => {
        // check xem token nay da dc su dung chua
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)
        if (foundToken) {
            // decode xem may la thang nao?
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)

            // xoa tat ca token trong keyStore
            await KeyTokenService.deleteKeyById(userId)

            throw new ForbiddenError('Some thing wrong happend. Please relogin')
        }

        // No, qua ngon
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop not register')

        // verifyToken
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)

        // check userId
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop not register')

        // create 1 cap moi
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        // update token
        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken // da duoc su dung de lay token moi roi
            }
        })

        return {
            user: { userId, email },
            tokens
        }
    }

    static logOut = async ({ keyStore }) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore)
        return delKey
    }

    /**
     * 1. check email in dbs
     * 2. match password
     * 3. create AT vs RT and save
     * 4.generate tokens
     * 5. get data return login
     */
    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email })

        if (!foundShop) {
            throw new BadRequestError('Shop not registed')
        }

        const match = bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new AuthFailureError('Password not match')
        }

        //3: create privateKey and public key
        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')
        const { _id: userId } = foundShop
        //4 
        const tokens = await createTokenPair({ userId, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey,
            userId,
        })

        return {
            metadata: {
                shop: getIntoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
                tokens
            }
        }
    }

    static signUp = async ({ name, email, password, roles }) => {
        try {
            // step1: check email exist
            // lean: make query quick. decrease 30 size
            const holderShop = await shopModel.findOne({ email }).lean()
            if (holderShop) {
                throw new BadRequestError('Error: Shop already registed')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                })

                if (!keyStore) {
                    return {
                        code: '222',
                        message: error.message,
                        status: 'keyStore error',
                    }
                }

                // create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

                return {
                    code: 201,
                    metadata: {
                        shop: getIntoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }

            return {
                code: 200,
                metadata: null
            }

        } catch (error) {
            console.log('error', error);

            return {
                code: '333',
                message: error.message,
                status: 'error',
            }
        }
    }
}

module.exports = AccessService