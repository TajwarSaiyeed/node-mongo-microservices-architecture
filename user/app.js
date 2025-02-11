const express = require("express");
const app = express();
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
require("dotenv").config();
const rabbitmq = require("./service/rabbit");
connectDB();
rabbitmq.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", userRoutes);

module.exports = app;
