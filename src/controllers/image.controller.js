const ImageModel = require("../models/image.model");
const { v4: uuid } = require("uuid");


const storageService = require("../services/storage.service");


async function createImage(req, res) {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    if (!req.file) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const { name, year } = req.body;

    if (!year) {
      return res.status(400).json({
        message: "Name and year required",
      });
    }

    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      uuid() + ".jpg"
    );

    const image = await ImageModel.create({
      name,
      year,
      image: fileUploadResult.url,
      fileId: fileUploadResult.fileId,
    });

    res.status(201).json({
      message: "Image created successfully",
      image,
    });

  } catch (error) {
    console.error("create image error:", error);

    res.status(500).json({
      message: "Failed to create image",
      error: error.message,
    });
  }
}


async function getImage(req, res) {
  try {
    const filter = {};

    if (req.query.year) {
      filter.year = req.query.year;
    }

    const images = await ImageModel.find(filter).sort({
      year: -1,
      createdAt: -1,
    });

    res.status(200).json({
      message: "Images fetched successfully",
      total: images.length,
      images,
    });

  } catch (error) {
    console.error("Get image error:", error);

    res.status(500).json({
      message: "Failed to fetch images",
    });
  }
}

/* ================= DELETE IMAGE ================= */
async function deleteImage(req, res) {
  try {
    const { id } = req.params;

    const image = await ImageModel.findById(id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    if (image.fileId && storageService) {
      await storageService.deleteFile(image.fileId);
    }

    await ImageModel.findByIdAndDelete(id);

    res.status(200).json({
      message: "Image deleted successfully",
    });

  } catch (error) {
    console.error("Delete image error:", error);

    res.status(500).json({
      message: "Failed to delete image",
    });
  }
}

/* ================= EXPORT ================= */
module.exports = {
  createImage,
  getImage,
  deleteImage,
};
