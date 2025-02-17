const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  profile,
  acceptedRide,
} = require("../controllers/user.controller");

const userAuth = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
// logged in user profile
router.get("/profile", userAuth, profile);
router.get(
  "/accepted-ride",
  userAuth,
  acceptedRide
);


module.exports = router;
