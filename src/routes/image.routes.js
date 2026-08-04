const express = require("express");
const router = express.Router();
const multer = require("multer");

const imageController = require("../controllers/image.controller");
const authMiddleware = require("../middleware/auth.middleware");

// multer setup
const upload = multer({
  storage: multer.memoryStorage(),
});

/* ================= CREATE IMAGE ================= */
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  imageController.createImage
);

/* ================= GET IMAGES ================= */
router.get(
  "/",
  imageController.getImage
);

/* ================= DELETE IMAGE ================= */
router.delete(
  "/:id",
  authMiddleware,
  imageController.deleteImage
);

module.exports = router;