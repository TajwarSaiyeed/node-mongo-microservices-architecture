const express = require("express");
const router = express.Router();
const { captainAuth, userAuth } = require("../middlewares/authMiddleware");
const { createRide, acceptRide } = require("../controllers/ride.controller");

router.post("/create-ride", userAuth, createRide);
router.put("/accept-ride", captainAuth, acceptRide);

module.exports = router;
