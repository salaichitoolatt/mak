import express, { Request, Response } from "express";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

let ACCESS_KEY = process.env.ACCESS_KEY as string;
let SECRET_KEY = process.env.SECRET_KEY as string;
let bucketName = process.env.BUCKET_NAME || "video-verg";
const PORT = process.env.PORT || 3000;

const client = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

const app = express();

app.get("/video", async (req: Request, res: Response): Promise<void> => {
  try {
    const videoPath = req.query.path as string;

    if (!videoPath) {
      res.status(400).send("No video path provided");
      return;
    }

    const input = {
      Bucket: bucketName,
      Key: videoPath,
    };

    try {
      const command = new GetObjectCommand(input);
      const response = await client.send(command);

      if (!response.Body) {
        res.status(404).send("Video not found");
        return;
      }

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Accept-Ranges", "bytes");

      if (response.ContentLength) {
        res.setHeader("Content-Length", response.ContentLength.toString());
      }

      const stream = response.Body as NodeJS.ReadableStream;
      stream.pipe(res);
    } catch (error) {
      console.error("Error fetching the video:", error);
      res.status(404).send("Video not found");
    }
  } catch (error) {
    console.error("Error processing the request:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () =>
  console.log(`S3 Blob Storage microservice online 🚀🚀🚀 on port ${PORT}`)
);
