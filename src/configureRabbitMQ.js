import amqp from 'amqplib';

export default async function configureRabbitMQ() {
  const listeners = {};
  const publishers = {};

  try {
    const rabbitUrl = `${process.env.RABBIT_MQ_HOST}:${
      process.env.RABBIT_MQ_PORT
    }`;
    console.log(`connecting to RabbitMQ @ ${rabbitUrl}`);
    const connection = await amqp.connect(rabbitUrl);

    async function publish(exchange, routingKey, payload) {
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
    }

    async function listen(exchange, routingKey, onMessage) {
      const channel = await connection.createChannel();
      channel.assertExchange(exchange, 'topic', { durable: false });
      const queue = await channel.assertQueue('', { exclusive: true });
      channel.bindQueue(queue.queue, exchange, routingKey);
      channel.consume(queue.queue, function(message) {
        const data = JSON.parse(message.content.toString());
        onMessage(data);
      });
    }

    return {
      publish,
      listen,
    };
  } catch (err) {
    console.error(err);
    return false;
  }
}
