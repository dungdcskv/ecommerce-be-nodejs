'use strict'


const { Types } = require("mongoose")
const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {

    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        // level 0
        // const tokens = await keyTokenModel.create({
        //     user: userId,
        //     publicKey,
        //     privateKey
        // })
        // return tokens ? tokens.publicKey : null

        // level xxx
        const filter = { user: userId }
        const update = {
            publicKey, privateKey, refreshTokenUsed: [], refreshToken
        }
        const options = { upsert: true, new: true }
        const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
        return tokens ? tokens.publicKey : null
    }

    static findByUserId = async (userId) => {
        try {
            return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
        } catch (error) {
            console.log('error', error);

        }
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id })
    }

    static findByRefreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel.deleteOne({ user: new Types.ObjectId(userId) })
    }

}

module.exports = KeyTokenService