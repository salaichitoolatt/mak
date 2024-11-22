import express from "express";
import fs from "fs";
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/video", async (req, res) => {
  const videoPath = "videos/Sample.mp4";
  const stats = await fs.promises.stat(videoPath);
  
  res.writeHead(200, {
    "content-length": stats.size,
    "content-type": "video/mp4",
  });
  fs.createReadStream(videoPath).pipe(res);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () =>
  console.log(`Server has started on port ${PORT} 🚀🚀🚀`)
);
