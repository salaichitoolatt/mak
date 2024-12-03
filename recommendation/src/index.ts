import express, { Request, Response } from "express";

const app = express();

app.get("/status", (req: Request, res: Response) => {
  res.send("Service online.");
});

app.liste(3000, () => console.log("Microservice online."));
