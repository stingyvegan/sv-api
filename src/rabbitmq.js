import amqp from 'amqplib';

let connection = undefined;
let channel = undefined;

export default {
  publish: async (exchange, routingKey, payload) => {
    try {
      channel.assertExchange(exchange, 'topic', { durable: false });
      channel.publish(
        exchange,
        routingKey,
        new Buffer(JSON.stringify(payload)),
      );
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },
  listen: async (exchange, routingKey, onMessage, onClose) => {
    channel.assertExchange(exchange, 'topic', { durable: false });
    const queue = await channel.assertQueue('', { exclusive: true });
    channel.bindQueue(queue.queue, exchange, routingKey);
    channel.consume(queue.queue, function(message) {
      if (message) {
        const data = JSON.parse(message.content.toString());
        onMessage(data);
      } else {
        if (onClose) onClose();
      }
    });
    return queue.queue;
  },
  cancelListen: async queue => {
    channel.deleteQueue(queue);
  },
  configureRabbitMQ: async () => {
    const rabbitUrl = `amqp://${process.env.RABBIT_MQ_USER}:${
      process.env.RABBIT_MQ_PASS
    }@${process.env.RABBIT_MQ_HOST}:${process.env.RABBIT_MQ_PORT}`;
    console.log(`Connecting to RabbitMQ @ ${rabbitUrl}`); // eslint-disable-line no-console
    connection = await amqp.connect(rabbitUrl);
    console.log('Connection to RabbitMQ established successfully'); // eslint-disable-line no-console
    channel = await connection.createChannel();
    console.log('RabbitMQ channel opened'); // eslint-disable-line no-console
  },
  disconnectRabbitMQ: async () => {
    try {
      await connection.close();
      console.log('RabbitMQ connection closed successfully'); // eslint-disable-line no-console
    } catch (e) {
      console.log('Error closing RabbitMQ connection and/or channel', e); // eslint-disable-line no-console
    }
  },
};
