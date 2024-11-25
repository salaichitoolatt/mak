import express, { Request, Response } from "express";
import * as Minio from "minio";

let ACCESS_KEY = "duWkd7MGEI8KtWpt7kPW";
let SECRET_KEY = "16HlgYxFNQOfgwJWea5REHGXqbWcEPykIrJKDl53";
let bucketName = process.env.BUCKET_NAME || "bmdk1";
const PORT = process.env.PORT || 3000;

const minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
});

const app = express();

app.get("/video", async (req: Request, res: Response): Promise<void> => {
  try {
    const videoPath = req.query.path as string;

    if (!videoPath) {
      res.status(400).send("No video path provided");
      return;
    }

    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      console.log("Bucket does not exist.");
      res.status(404).send("Bucket Not Found");
      return;
    }

    try {
      // Get the stats of the video file
      const stat = await minioClient.statObject(bucketName, videoPath);

      // Set the response headers
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Accept-Ranges", "bytes");
      res.setHeader("Content-Length", stat.size); // Content-Length header

      // Get the data stream from Minio and pipe it to the response
      const dataStream = await minioClient.getObject(bucketName, videoPath);

      dataStream.on("error", (err) => {
        console.log("Error while streaming the video:", err);
        return res.status(500).send("Error streaming video");
      });

      dataStream.pipe(res);

      dataStream.on("end", () => {
        console.log("Video streaming finished");
      });
    } catch (error) {
      console.log("Error fetching the video:", error);
      res.status(404).send("Video not found");
      return;
    }
  } catch (error) {
    console.log("Error checking bucket:", error);
    res.status(500).send("Internal Server Error");
    return;
  }
});

app.listen(PORT, () =>
  console.log(`Minio Blob Storage microservice online 🚀🚀🚀 on port ${PORT}`)
);
