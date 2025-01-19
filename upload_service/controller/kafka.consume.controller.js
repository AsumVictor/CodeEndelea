import Kafka_controller from "../kafka/kafka.config.js";

const kafka_consumer = (req, res, next) => {
  const consumer = new Kafka_controller();
  consumer.consume("transcode", (value) => {
    console.log("Got data from kafka : ", value);
  });


  next()
};
export default kafka_consumer;
