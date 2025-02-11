const captainModel = require("../models/captain.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklisttokenModel = require("../models/blacklisttoken.model");
const { subscribeToQueue } = require("../service/rabbit");
const pendingRequests = [];

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const captain = await captainModel.findOne({
      email,
    });

    if (captain) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newCaptain = new captainModel({
      name,
      email,
      password: hashPassword,
    });

    await newCaptain.save();

    const token = jwt.sign(
      {
        id: newCaptain._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token);

    res.status(201).json({
      token,
      captain: newCaptain,
      message: "Captain created successfully",
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
    const captain = await captainModel
      .findOne({
        email,
      })
      .select("+password");

    if (!captain) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, captain.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: captain._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    delete captain._doc.password;

    res.cookie("token", token);

    res.send({
      token,
      captain,
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
      message: "Captain logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const profile = async (req, res) => {
  try {
    res.send(req.captain);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.captain._id);
    captain.isAvailable = !captain.isAvailable;
    await captain.save();
    res.send(captain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const waitForNewRide = async (req, res) => {
  req.setTimeout(30000, () => {
    res.status(204).end();
  });

  pendingRequests.push(res);
};

subscribeToQueue("new-ride", (data) => {
  
  const rideData = JSON.parse(data);
  
  pendingRequests.forEach((res) => {
    res.json(rideData);
  });

  pendingRequests.length = 0;
});

module.exports = {
  register,
  login,
  logout,
  profile,
  toggleAvailability,
  waitForNewRide,
};
