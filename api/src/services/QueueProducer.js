import amqp from "amqplib";

class QueueProducer {
  async produce(message, queue) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);

      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true
      }); // durable means that if rabbitmq crashes it will not forget this queue

      await channel.sendToQueue(queue, Buffer.from(message), {
        persistent: true
      }); // durable means that if rabbitmq crashes it will not forget this message

      console.log(`Sent ${message} to queue ${queue}`);

      setTimeout(() => connection.close(), 500);
    } catch (err) {
      console.warn(err);
    }
  }
}

export default QueueProducer;
