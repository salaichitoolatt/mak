import express, { Request, Response } from "express";
import http from "http";

const app = express();

if (!process.env.PORT) {
  throw new Error(
    "Please specify the port number for the HTTP server with the environment variable PORT."
  );
}

const PORT = process.env.PORT;
const VIDEO_STORAGE_HOST = process.env.VIDEO_STORAGE_HOST || "localhost";
const VIDEO_STORAGE_PORT = process.env.VIDEO_STORAGE_PORT || 3001;

app.get("/video", async (req: Request, res: Response): Promise<void> => {
  const forwardRequest = http.request(
    {
      host: VIDEO_STORAGE_HOST,
      port: VIDEO_STORAGE_PORT,
      path: "/video?path=Sample.mp4",
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
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () =>
  console.log(`Video streaming microservice online 🚀🚀🚀`)
);
