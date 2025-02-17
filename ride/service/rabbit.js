const amqp = require("amqplib");

const RABBIT_MQ_URI = process.env.RABBIT_MQ_URI;

let connection, channel;
async function connect() {
  if (connection && channel) {
    console.log("Using existing RabbitMQ connection");
    return;
  }
  connection = await amqp.connect(RABBIT_MQ_URI);
  channel = await connection.createChannel();
  console.log("Connected to RabbitMQ");
}

async function subscribeToQueue(queueName, callback) {
  if (!channel) await connect();
  await channel.assertQueue(queueName);
  channel.consume(queueName, (message) => {
    callback(message.content.toString());
    channel.ack(message);
  });
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
