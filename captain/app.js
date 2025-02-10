const express = require("express");
const app = express();
const captainRoutes = require("./routes/captain.routes");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
require("dotenv").config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", captainRoutes);

module.exports = app;
