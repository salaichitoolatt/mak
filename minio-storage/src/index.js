import express from "express";
import * as Minio from "minio";

let ACCESS_KEY = "duWkd7MGEI8KtWpt7kPW";
let SECRET_KEY = "16HlgYxFNQOfgwJWea5REHGXqbWcEPykIrJKDl53";
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

    const bucketName = "bmdk1";
    //
    const data = await minioClient.bucketExists(bucketName);
    if (!data) {
      console.log("Bucket not exists.");
      return res.send("Bucket Not Found");
    }
    
    const dataStream = await minioClient.getObject(bucketName, videoPath)

  } catch (error) {
    console.log(error);
  }

});

app.listen(PORT, () =>
  console.log(`Minio Blob Storage  microservice online 🚀🚀🚀`)
);
