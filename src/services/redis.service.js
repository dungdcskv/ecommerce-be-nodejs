'use strict'

const { redisClient } = require('../dbs/model.redis')
const { reservationInventory } = require('../models/repositories/inventory.repo')

redisClient.on('error', (err) => console.error('Redis Client Error', err))

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000 // 3s temporary lock

    for (let i = 0; i < retryTimes; i++) {
        const result = await redisClient.set(key, expireTime, {
            NX: true, // Only set if not exists
            PX: expireTime, // Expiration time in milliseconds
        })
        console.log(`result:::`, result)
        if (result) {
            const isReservation = await reservationInventory({
                productId, quantity, cartId,
            })
            if (isReservation.modifiedCount) {
                return key
            }
            return key
        } else {
            await new Promise(resolve => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock) => {
    return await redisClient.del(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock,
}
