import amqp from 'amqplib';
import logger from './logger';

let connection;
let channel;

export default {
  publish: async (exchange, routingKey, payload) => {
    try {
      channel.assertExchange(exchange, 'topic', { durable: false });
      channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(payload)),
      );
      return true;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },
  listen: async (exchange, routingKey, onMessage, onClose) => {
    channel.assertExchange(exchange, 'topic', { durable: false });
    const queue = await channel.assertQueue('', { exclusive: true });
    channel.bindQueue(queue.queue, exchange, routingKey);
    channel.consume(queue.queue, (message) => {
      if (message) {
        const data = JSON.parse(message.content.toString());
        onMessage(data);
      } else if (onClose) onClose();
    });
    return queue.queue;
  },
  cancelListen: async (queue) => {
    channel.deleteQueue(queue);
  },
  configureRabbitMQ: async () => {
    const rabbitUrl = `amqp://${process.env.RABBIT_MQ_USER}:***@${process.env.RABBIT_MQ_HOST}:${process.env.RABBIT_MQ_PORT}`;
    logger.info(`Connecting to RabbitMQ @ ${rabbitUrl}`);
    connection = await amqp.connect({
      username: process.env.RABBIT_MQ_USER,
      password: process.env.RABBIT_MQ_PASS,
      hostname: process.env.RABBIT_MQ_HOST,
      port: process.env.RABBIT_MQ_PORT,
      protocol: 'amqp',
    });
    logger.info('Connection to RabbitMQ established successfully');
    channel = await connection.createChannel();
    logger.info('RabbitMQ channel opened');
  },
  disconnectRabbitMQ: async () => {
    try {
      await connection.close();
      logger.info('RabbitMQ connection closed successfully');
    } catch (e) {
      logger.info('Error closing RabbitMQ connection and/or channel', e);
    }
  },
};
