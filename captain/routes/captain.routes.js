const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  profile,
  toggleAvailability,
} = require("../controllers/captain.controller");

const captainAuth = require("../middlewares/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
// logged in captain profile
router.get("/profile", captainAuth, profile);
router.patch(
  "/toggle-availability",
  captainAuth,
  toggleAvailability
);

module.exports = router;
