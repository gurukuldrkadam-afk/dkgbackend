
const Notice = require("./../models/notice.model");
const storageService = require("./../services/storage.service");
const { v4: uuid } = require("uuid");


async function uploadNotice(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: "File required" });

    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Title required" });

    const uploadResult = await storageService.uploadFile(
      req.file.buffer.toString("base64"),
      `${uuid()}-${req.file.originalname}`
    );

    const notice = await Notice.create({
      title,
      fileUrl: uploadResult.url,
      fileId: uploadResult.fileId,
    });

    res.status(201).json({ message: "Notice uploaded", notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed" });
  }
}


async function getNotices(req, res) {
  try {
    const notices = await Notice.find().sort({ uploadedAt: -1 });
    res.status(200).json({ notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notices" });
  }
}


async function deleteNotice(req, res) {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ message: "Notice not found" });

    if (notice.fileId) await storageService.deleteFile(notice.fileId);

    await Notice.findByIdAndDelete(id);

    res.status(200).json({ message: "Notice deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
}

module.exports = { uploadNotice, getNotices, deleteNotice };
