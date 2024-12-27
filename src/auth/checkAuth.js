'use strict'

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}

const { findById } = require('../services/apiKey.service')

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(503).json({
                message: 'Forbidden error111'
            })
        }

        // check objKey
        const objKey = await findById(key)

        if (!objKey) {
            return res.status(504).json({
                message: 'Forbidden error222'
            })
        }

        req.objKey = objKey
        return next()

    } catch (error) {
        console.log('error', error);
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(603).json({
                message: 'permissions denied'
            })
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(603).json({
                message: 'permissions denied'
            })
        }
        return next()
    }
}

module.exports = {
    apiKey,
    permission,
}