import amqp from 'amqplib';

let connection = undefined;

export default {
  publish: async (exchange, routingKey, payload) => {
    try {
      const channel = await connection.createChannel();
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
    const channel = await connection.createChannel();
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
    const channel = await connection.createChannel();
    channel.deleteQueue(queue);
  },
  configureRabbitMQ: async () => {
    const rabbitUrl = `amqp://${process.env.RABBIT_MQ_USER}:${
      process.env.RABBIT_MQ_PASS
    }@${process.env.RABBIT_MQ_HOST}:${process.env.RABBIT_MQ_PORT}`;
    console.log(`Connecting to RabbitMQ @ ${rabbitUrl}`); // eslint-disable-line no-console
    connection = await amqp.connect(rabbitUrl);
    console.log('Connection to RabbitMQ established successfully'); // eslint-disable-line no-console
  },
};
