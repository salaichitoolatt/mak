import express, { Request, Response } from "express";
import amqp, { ConsumeMessage, Message } from "amqplib";
import mongodb from "mongodb";

const PORT = process.env.PORT;
const RABBIT = process.env.RABBIT as string;
const DBHOST = process.env.DBHOST as string;
const DBNAME = process.env.DBNAME;

async function main() {
  const mongoClient = await mongodb.MongoClient.connect(DBHOST);
  const db = mongoClient.db(DBNAME);
  const historyCollection = db.collection("history");

  const app = express();
  const messagingConnection = await amqp.connect(RABBIT);
  const messageChannel = await messagingConnection.createChannel();

  await messageChannel.assertExchange("viewed", "fanout");

  const {queue} = await messageChannel.assertQueue("", {exclusive: true});

  await messageChannel.bindQueue(queue, "viewed", "");
  
  await messageChannel.consume("viewed", async (msg: ConsumeMessage | null) => {
    if (msg) {
      const parsedMsg = JSON.parse(msg?.content.toString() as string);

      await historyCollection.insertOne({
        videoPath: parsedMsg.videoPath,
      });

      messageChannel.ack(msg);
    }
  });

  app.listen(PORT);
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
