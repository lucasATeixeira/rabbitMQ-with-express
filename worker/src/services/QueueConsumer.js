import amqp from "amqplib";

class QueueConsumer {
  async consume(queue) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);

      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true
      });

      channel.prefetch(1); // This tells RabbitMQ not to give more than one message to a worker at a time.

      console.log(` [*] Waiting for messages in queue: ${queue}`);

      await channel.consume(
        queue,
        msg => {
          console.log(
            `   [*] Received ${msg.content.toString()} from queue ${queue}`
          );

          setTimeout(() => {
            console.log("    [*] Done");
            channel.ack(msg); // An ack(nowledgement) is sent back by the consumer to tell RabbitMQ that a particular message has been received, processed and that RabbitMQ is free to delete it.
          }, 5000);
        },
        {
          noAck: false
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }
}

export default QueueConsumer;
