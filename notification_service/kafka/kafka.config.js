import { Kafka } from "kafkajs";

export default class KafkaController {
  constructor(clientId, brokers) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
    });
  }

  createProducer() {
    return this.kafka.producer();
  }

  createConsumer(groupId) {
    return this.kafka.consumer({ groupId });
  }
}
