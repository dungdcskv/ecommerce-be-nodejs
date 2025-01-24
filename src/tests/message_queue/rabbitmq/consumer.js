const amqp = require('amqplib')
const message = 'hello, rabbitMQ for Ecommerce'

const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://localhost')
        const channel = await connection.createChannel()

        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })

        // send messages to consumer channel
        channel.consume(queueName, (message) => {
            console.log(`Receive ${message.content.toString()}`);
        }, {
            noAck: true
        })
        // console.log(`message send: `, message);

    } catch (error) {
        console.error(error);
    }
}

runConsumer().catch(console.error())