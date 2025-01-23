import app from "./app.js";
import dotenv from "dotenv";
import Kafka_controller from "./kafka/kafka.config.js";
import Transcode from "./utilities/transcode.utility.js";
import { consumeMessages } from "./kafka/comsume.job.js";
import { produceMessage } from "./kafka/produce.job.js";

// connect to environment variables
if (
  process.env.NODE_ENV !== "PRODUCTION" ||
  process.env.NODE_ENV != "production"
) {
  dotenv.config({
    path: "./.env",
  });
}

// Hangling uncatch execptions
process.on("unCaughtException", (err) => {
  console.log(`Error: => ${err.message}`);
  console.log("Server shutting down");
});

consumeMessages("transcode", async (value) => {
  const { title, url, field, _id } = value;
  Transcode(title, url, field, _id);
});

const server = app.listen(process.env.PORT, async (err) => {
  // connect to database
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});

// handle promises failure
process.on("onhandleRejection", (err) => {
  console.log(`Shutting down server --> ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
