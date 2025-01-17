'use strict'

const redis = require('redis');

// Create a Redis client
const redisClient = redis.createClient({
    host: '127.0.0.1',
    port: 6379
});

// Connect the client
// Event listener for successful connection
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});



redisClient.on('ready', () => {
    console.log('Redis client is ready');
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

redisClient.on('end', () => {
    console.log('Redis connection closed');
});

const get = async (key) => {
    try {
        return await redisClient.get(key);
    } catch (err) {
        throw new Error(err);
    }
};

const set = async (key, count) => {
    try {
        await redisClient.set(key, count);
    } catch (err) {
        throw new Error(err);
    }
};

const incrby = async (key, count) => {
    try {
        return await redisClient.incrBy(key, count);
    } catch (err) {
        throw new Error(err);
    }
};

const decrby = async (key, count) => {
    try {
        return await redisClient.decrBy(key, count);
    } catch (err) {
        throw new Error(err);
    }
};

const exists = async (key) => {
    try {
        return await redisClient.exists(key);
    } catch (err) {
        throw new Error(err);
    }
};

const setnx = async (key, value) => {
    try {
        return await redisClient.setNX(key, value);
    } catch (err) {
        throw new Error(err);
    }
};

const redisDel = async ([key]) => {
    try {
        return await redisClient.del(key);
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {
    get,
    set,
    incrby,
    decrby,
    exists,
    setnx,
    redisDel,
    redisClient,
}