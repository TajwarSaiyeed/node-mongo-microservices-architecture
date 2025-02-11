const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklisttokenModel = require("../models/blacklisttoken.model");
const { subscribeToQueue } = require("../service/rabbit");
const EventEmitter = require("events");
const rideEventEmitter = new EventEmitter();

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await userModel.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      name,
      email,
      password: hashPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token);

    res.status(201).json({
      token,
      user: newUser,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    delete user._doc.password;

    res.cookie("token", token);

    res.send({
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    await blacklisttokenModel.create({ token });
    res.clearCookie("token");
    res.send({
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const profile = async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const acceptedRide = async (req, res) => {
  const timeoutId = setTimeout(() => {
    res.status(204).send();
  }, 30000);

  rideEventEmitter.once("ride-accepted", (data) => {
    clearTimeout(timeoutId);
    if (!res.headersSent) {
      res.send(data);
    }
  });
};

subscribeToQueue("ride-accepted", async (msg) => {
  const data = JSON.parse(msg);
  rideEventEmitter.emit("ride-accepted", data);
});

module.exports = {
  register,
  login,
  logout,
  profile,
  acceptedRide,
};
