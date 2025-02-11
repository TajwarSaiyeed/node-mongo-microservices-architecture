const jwt = require("jsonwebtoken");
const axios = require("axios");

function extractToken(req) {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  if (req.headers && req.headers.authorization) {
    const parts = req.headers.authorization.split(" ");
    if (parts.length === 2 && parts[0] === "Bearer") {
      return parts[1];
    }
  }
  return null;
}

module.exports.userAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    });

    const response = await axios.get(`${process.env.BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = response.data;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.captainAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({ message: "Unauthorized" });
      }
    });

    const response = await axios.get(
      `${process.env.BASE_URL}/captain/profile`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const captain = response.data;
    if (!captain) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.captain = captain;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
