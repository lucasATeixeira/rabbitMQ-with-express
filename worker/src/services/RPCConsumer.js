import amqp from "amqplib";

function fibonacci(n) {
  if (n == 0 || n == 1) return n;
  else return fibonacci(n - 1) + fibonacci(n - 2);
}

class RPCConsumer {
  async consume(queue) {
    try {
      const connection = await amqp.connect(process.env.RABBITMQ_URL);

      const channel = await connection.createChannel();

      await channel.assertQueue(queue, {
        durable: true
      });

      channel.prefetch(1);

      console.log(" [*] Awaiting RPC requests");

      await channel.consume(queue.queue, async msg => {
        const number = parseInt(msg.content.toString());

        console.log(`  [*] Received RPC number ${number}`);

        const f = fibonacci(number);

        setTimeout(async () => {
          await channel.sendToQueue(
            msg.properties.replyTo,
            Buffer.from(f.toString()),
            {
              correlationId: msg.properties.correlationId
            }
          );
          channel.ack(msg);
        }, 4000);
      });
    } catch (err) {
      console.warn(err);
    }
  }
}

export default RPCConsumer;
