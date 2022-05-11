

const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

async function consumeMessage(msg) {
    console.log(msg.content.toString());
    //ТУТ обработка сообщений
}

(async () => {
    const connection = await amqplib.connect(amqpUrl, "heartbeat=60");
    const channel = await connection.createChannel();
    channel.prefetch(10);
    const queue = 'your.queue';
    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await channel.close();
        await connection.close();
        process.exit(0);
    });

    await channel.assertQueue(queue, { durable: true });
    await channel.consume(queue, async (msg) => {
        console.log('processing messages');
        await consumeMessage(msg);
        await channel.ack(msg);
    },
        {
            noAck: false,
            consumerTag: 'my_consumer'
        });
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();