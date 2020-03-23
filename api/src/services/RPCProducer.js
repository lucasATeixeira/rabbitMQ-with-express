import amqp from "amqplib";

class RPCProducer {
  generateUuid() {
    return (
      Math.random().toString() +
      Math.random().toString() +
      Math.random().toString()
    );
  }

  async produce(message, queue) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);

      const channel = await connection.createChannel();

      const callback_queue = await channel.assertQueue("", {
        exclusive: true
      }); // Creates an unique queue for receiving callback

      const correlationId = this.generateUuid(); // creates an uuid for filter income rpc callbacks

      const number = message;

      console.log(` [x] Requesting fib ${number} to queue ${queue}`);

      await channel.sendToQueue(queue, Buffer.from(number.toString()), {
        correlationId,
        replyTo: callback_queue.queue
      });

      await channel.consume(
        callback_queue.queue,
        msg => {
          if (msg.properties.correlationId === correlationId) {
            console.log("  [.] Got %s", msg.content.toString());
            setTimeout(() => connection.close(), 500);
          }
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

export default RPCProducer;
