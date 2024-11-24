import express from "express";
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

app.get("/video", async (req, res) => {
  try {
    const videoPath = req.query.path;

    const bucketExists = await minioClient.bucketExists(bucketName);
    if (!bucketExists) {
      console.log("Bucket does not exist.");
      return res.status(404).send("Bucket Not Found");
    }

    try {
      const stat = await minioClient.statObject(bucketName, videoPath);
      if (!stat) {
        res.status(404).send("Object Not Found");
      }

      let size = 0;
      const dataStream = await minioClient.getObject(bucketName, videoPath);
      dataStream.on("data", function (chunk) {
        size += chunk.length;
      });

      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Accept-Ranges", "bytes");

      dataStream.on("end", function () {
        console.log("End. Total Object size = " + size);
      });
      
      dataStream.on("error", function (err) {
        console.log(err);
      });

      dataStream.pipe(res);
    } catch (error) {
      console.log("Error fetching the video:", error);
      return res.status(404).send("Video not found");
    }
  } catch (error) {
    console.log("Error checking bucket:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () =>
  console.log(`Minio Blob Storage microservice online 🚀🚀🚀`)
);
