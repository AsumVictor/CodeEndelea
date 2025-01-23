import KafkaController from "./kafka.config.js";
import dotenv from 'dotenv'
if (
  process.env.NODE_ENV !== "PRODUCTION" ||
  process.env.NODE_ENV != "production"
) {
  dotenv.config({
    path: "./.env",
  });
}

console.log(process.env.KAFKA_BROKER)

const kafka = new KafkaController("transcode-service", [
  process.env.KAFKA_BROKER,
]);
const consumer = kafka.createConsumer("transcode-consumer-group");

export const consumeMessages = async (topic, callback) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = JSON.parse(message.value.toString());
      console.log("Received transcode message:", value);
      callback(value);
    },
  });
};

// // Example usage
// consumeMessages("transcode");
