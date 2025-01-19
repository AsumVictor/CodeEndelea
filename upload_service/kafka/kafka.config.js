import { Kafka } from "kafkajs";

export default class Kafka_controller {
  constructor() {
    this.kafka = new Kafka({
      clientId: process.env.KAFKA_CLIENT,
      brokers: [process.env.KAFKA_BROKER],
    });
    this.producer = this.kafka.producer()
    this.consumer = this.kafka.consumer({groupId: "uploading"})
  }

  async produce(topic, messages) {
    try {
      const result = await this.producer.connect();
    //   console.log("kafka connected... : ", result);
      await this.producer.send({
        topic: topic,
        messages: messages,
      });
    } catch (error) {
      console.log(error);
    } finally {
      await this.producer.disconnect();
    }
  }

  async consume(topic , callback){
    const consumer = this.kafka.consumer({groupId: "uploading"})

    try {
        await consumer.connect()
        await consumer.subscribe({topic: topic, fromBeginning: true})
        await consumer.run({
            eachMessage: async({
                topic, partition,message
            }) =>{
                const value = message.value.toString()
                callback(value)
            }
        })
    } catch (error) {
        console.log(error)
    }
}
}
