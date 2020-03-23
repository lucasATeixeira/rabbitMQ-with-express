import express from "express";
import dotenv from "dotenv";
import QueueConsumer from "./services/QueueConsumer";
import PubSubExchangeConsumer from "./services/PubSubExchangeConsumer";
import RPCConsumer from "./services/RPCConsumer";

dotenv.config();

const app = express();

app.use(express.json());

let queue = "queue";

const [queue_arg] = process.argv.filter(arg => arg.match("queue="));

if (queue_arg) {
  [, queue] = queue_arg.split("=");
}

const consumer = new QueueConsumer();

const pubSubConsumer = new PubSubExchangeConsumer();

const rpcConsumer = new RPCConsumer();

consumer.consume(queue);

pubSubConsumer.consume("logs");

rpcConsumer.consume("rpc");

export default app;
