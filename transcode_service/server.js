import app from "./app.js";
import dotenv from "dotenv";


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

// const consumer = new Kafka_controller();

// consumer.consume("update_url", async (value) => {
//   const { field, url, _id } = JSON.parse(value);
//   update_video_url(field, url, _id);
// });

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
