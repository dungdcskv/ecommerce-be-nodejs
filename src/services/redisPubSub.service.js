'use strict'

const { createClient } = require('redis');

class RedisPubSubService {

    constructor() {
        this.subscriber = createClient();
        this.publisher = createClient();
    }

    async publish(channel, message) {
        return await this.publisher.publish(channel, message, (err, reply) => {

        })
    }

    async subscribe(channel, callback) {
        this.subscriber.subscribe(channel)
        this.subscriber.on('message', (subscriberChanel, message) => {
            if (channel === subscriberChanel) {
                callback(channel, message)
            }
        })
    }

}

module.exports = new RedisPubSubService()