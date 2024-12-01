import { Channel } from "amqplib";
import express, { Request, Response } from "express";
import http from "http";
import mongodb from "mongodb";
import amqp from "amqplib";

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST || "localhost";
const VIDEO_STORAGE_PORT = process.env.VIDEO_STORAGE_PORT || 3001;
const DBHOST = process.env.DBHOST as string;
const DBNAME = process.env.DBNAME;
const RABBIT = process.env.RABBIT as string;

async function main() {
  const messagingConnection = await amqp.connect(RABBIT);

  const mongoClient = await mongodb.MongoClient.connect(DBHOST);
  const db = mongoClient.db(DBNAME);
  const videosCollection = db.collection("videos");

  const app = express();

  const messageChannel = await messagingConnection.createChannel();

  app.get("/video", async (req: Request, res: Response): Promise<void> => {
    const videoId = new mongodb.ObjectId(req.query.id as string);
    const videoRecord = await videosCollection.findOne({ _id: videoId });

    if (!videoRecord) {
      res.sendStatus(404);
      return;
    }

    const forwardRequest = http.request(
      {
        host: VIDEO_STORAGE_HOST,
        port: VIDEO_STORAGE_PORT,
        path: `/video?path=${videoRecord.videoPath}`,
        method: "GET",
        headers: req.headers,
      },
      (forwardResponse) => {
        const statusCode = forwardResponse.statusCode ?? 200;
        res.writeHead(statusCode, forwardResponse.headers);
        forwardResponse.pipe(res);
      }
    );

    forwardRequest.on("error", (err) => {
      // Handle the error (e.g., by returning a 500 or other error status)
      res.writeHead(500);
      res.end("Error forwarding the request");
    });

    forwardRequest.end();

    sendViewedMessage(messageChannel, videoRecord.videoPath);
  });

  app.listen(PORT);
}

function sendViewedMessage(messageChannel: Channel, videoPath: string) {
  const msg = { videoPath: videoPath };
  const jsonMsg = JSON.stringify(msg);
  messageChannel.publish("", "viewed", Buffer.from(jsonMsg));
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
