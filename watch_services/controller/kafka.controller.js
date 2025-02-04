import Kafka_controller from "../kafka/kafka.config.js";
import { nanoid } from "nanoid";

export const kafka_transcode = async (title, url, field, _id) => {
  try {
    const message = {
      title: title,
      url: url,
      field,
      _id,
    };

    const kafkaconfig = new Kafka_controller();
    const msgs = [
      {
        key: nanoid(),
        value: JSON.stringify(message),
      },
    ];
    await kafkaconfig.produce("transcode", msgs);
  } catch (error) {
    console.log(error);
  }
};

