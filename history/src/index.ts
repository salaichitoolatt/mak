import express, { Request, Response } from "express";
import amqp from "amqplib";

const PORT = process.env.PORT;
const RABBIT = process.env.RABBIT as string;

async function main() {
  const app = express();
  const messagingConnection = await amqp.connect(RABBIT);
  const messageChannel = await messagingConnection.createChannel();

  app.listen(PORT);
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
