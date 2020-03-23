import amqp from "amqplib";

class PubSubExchangeConsumer {
  async consume(exchange) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);

      const channel = await connection.createChannel();

      await channel.assertExchange(exchange, "fanout", {
        durable: false
      });

      const queue = await channel.assertQueue("", {
        exclusive: true
      });

      console.log(` [*] Waiting for pub/sub logs`);

      await channel.bindQueue(queue.queue, exchange, "");

      await channel.consume(
        queue.queue,
        msg => {
          console.log(
            `   [*] Received the following log: "${msg.content.toString()}"`
          );
        },
        {
          noAck: true
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }
}

export default PubSubExchangeConsumer;
