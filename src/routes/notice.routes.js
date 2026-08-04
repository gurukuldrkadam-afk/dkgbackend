// routes/notice.routes.js
const express = require("express");
const router = express.Router();
const noticeController = require("../controllers/notice.controller");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });


router.post("/", authMiddleware, upload.single("file"), noticeController.uploadNotice);


router.get("/", noticeController.getNotices);


router.delete("/:id", authMiddleware, noticeController.deleteNotice);

module.exports = router;
