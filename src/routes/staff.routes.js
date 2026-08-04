const express = require("express");
const staffController = require("../controllers/staff.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post(
  "/",
  authMiddleware,
  upload.single("image"), 
  staffController.createStaff
);


router.get(
  "/",
  staffController.getStaff
);

router.delete(
  "/:id",
  authMiddleware,
  staffController.deleteStaff
);

module.exports = router;
