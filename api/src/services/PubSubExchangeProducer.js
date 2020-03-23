import amqp from "amqplib";

class PubSubExchangeProducer {
  async produce(message, exchange) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);

      const channel = await connection.createChannel();

      await channel.assertExchange(exchange, "fanout", {
        durable: false
      });

      await channel.publish(exchange, "", Buffer.from(message));

      console.log(`Sent: "${message}" to exchange: "${exchange}"`);

      setTimeout(() => connection.close(), 500);
    } catch (err) {
      console.warn(err);
    }
  }
}

export default PubSubExchangeProducer;
