// sử dụng single tone design pattern
'use strict'

const mongoose = require('mongoose')
const { db: { host, name, port } } = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`

class Database {
    constructor() {
        this.connect()
    }

    // use type if switch to use another database as: mysql, oracle,...
    connect(type = 'mongo') {
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString).then(_ => console.log('Connect to Mongodb Success'))
            .catch(err => console.log('Error connect'))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb