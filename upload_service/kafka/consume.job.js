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

const kafka = new KafkaController("upload-service", [process.env.KAFKA_BROKER]);
const consumer = kafka.createConsumer("upload-consumer-group");

export const consumeMessages = async (topic, callback) => {
  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log("Received update URL message:", JSON.parse(value));
      callback(value)
    },
  });
};

// // Example usage
// consumeMessages("update-url");
