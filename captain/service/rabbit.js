const amqp = require("amqplib");

const RABBIT_MQ_URI = process.env.RABBIT_MQ_URI;


let connection, channel;
async function connect() {
  connection = await amqp.connect(RABBIT_MQ_URI);
  channel = await connection.createChannel();
  console.log("Connected to RabbitMQ");
}

async function subscribeToQueue(queueName, callback) {
  if (!channel) await connect();
  try {
    await channel.assertQueue(queueName);

    console.log(`Waiting for messages in ${queueName}`);

    channel.consume(queueName, (message) => {
      callback(message.content.toString());
      channel.ack(message);
    });

  } catch (error) {
    console.log(error);
  }
}

async function publishToQueue(queueName, data) {
  if (!channel) await connect();
  await channel.assertQueue(queueName);
  channel.sendToQueue(queueName, Buffer.from(data));
}

module.exports = {
  subscribeToQueue,
  publishToQueue,
  connect,
};
