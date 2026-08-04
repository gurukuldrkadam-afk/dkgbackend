const express = require("express");
const governingController = require('../controllers/governing.controller');
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  governingController.createStaff
);


router.get(
  "/",
  governingController.getStaff
);


router.delete(
  "/:id",
  authMiddleware,
  governingController.deleteStaff
);

module.exports = router;
