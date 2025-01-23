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
const producer = kafka.createProducer();

export const produceMessage = async (topic, message) => {
  await producer.connect();
  await producer.send({
    topic,  
    messages: [{ value: JSON.stringify(message) }],
  });
  await producer.disconnect();
};
