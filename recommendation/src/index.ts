import express, { Request, Response } from "express";

const app = express();

const PORT = process.env.PORT;

async function main() {
  app.get("/status", (req: Request, res: Response) => {
    res.send("Service online.");
  });

  app.listen(PORT);
}

main().catch((err) => {
  console.error("Microservice failed to start.");
  console.error((err && err.stack) || err);
});
