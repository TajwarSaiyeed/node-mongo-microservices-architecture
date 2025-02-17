const express = require("express");
const app = express();
require("dotenv").config();

const captainRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
connectDB();
const rabbitmq = require("./service/rabbit");
rabbitmq.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", captainRoutes);

module.exports = app;
