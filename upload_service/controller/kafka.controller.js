import Kafka_controller from "../kafka/kafka.config.js";

export const kafka_transcode = async (title, url) => {
  try {
    const message = {
      title: title,
      url: url,
    };

    const kafkaconfig = new Kafka_controller();
    const msgs = [
      {
        key: "video",
        value: JSON.stringify(message),
      },
    ];
    await kafkaconfig.produce("transcode", msgs);
  } catch (error) {
    console.log(error);
  }
};
