import { Router } from "express";
import QueueProducer from "./services/QueueProducer";
import PubSubExchangeProducer from "./services/PubSubExchangeProducer";
import RPCProducer from "./services/RPCProducer";

const routes = Router();

routes.post("/rpc_message", async (req, res) => {
  const { message, queue } = req.body;

  const producer = new RPCProducer();

  await producer.produce(message, queue);

  return res.send();
});

routes.post("/pubsub_message", async (req, res) => {
  const { message } = req.body;

  const producer = new PubSubExchangeProducer();

  await producer.produce(message, "logs");

  return res.send();
});

routes.post("/worker_message", async (req, res) => {
  const { message, queue } = req.body;

  const producer = new QueueProducer();

  await producer.produce(message, queue);

  return res.send();
});

export default routes;
