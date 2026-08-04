const express = require("express");

const {
  sendOtp,
  verifyOtp,
  getParentProfile,
  logoutParent,
} = require("../controllers/parent.controller");

const verifyParent = require("../middleware/verifyParent");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/profile", verifyParent, getParentProfile);
router.post("/logout", verifyParent, logoutParent);

module.exports = router;