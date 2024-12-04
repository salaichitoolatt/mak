import express, { Request, Response } from "express";

const app = express();

const PORT = process.env.PORT;

app.get("/status", (req: Request, res: Response) => {
  res.send("Service online.");
});

app.listen(PORT, () => console.log("Microservice online."));
