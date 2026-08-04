const GoverningStaffModel = require("./../models/governing.model");
const storageService = require("./../services/storage.service");
const { v4: uuid } = require("uuid");


async function createStaff(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { name, role, type } = req.body;

    if (!name || !role || !type) {
      return res.status(400).json({
        message: "Name, role and type are required",
      });
    }

    const fileUploadResult = await storageService.uploadFile(
      req.file.buffer,
      uuid()
    );

    const staff = await GoverningStaffModel.create({
      name,
      role,
      image: fileUploadResult.url,
      type,
    });

    res.status(201).json({
      message: "Staff created successfully",
      staff,
    });
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({
      message: "Failed to create staff",
    });
  }
}


async function getStaff(req, res) {
  try {
    const filter = {};

    if (req.query.type) {
      filter.type = req.query.type;
    }

    const staff = await GoverningStaffModel.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Staff members fetched successfully",
      total: staff.length,
      staff,
    });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({
      message: "Failed to fetch staff",
    });
  }
}

// ================= DELETE STAFF =================
async function deleteStaff(req, res) {
  try {
    const { id } = req.params;

    const staff = await GoverningStaffModel.findByIdAndDelete(id);

    if (!staff) {
      return res.status(404).json({
        message: "Staff not found",
      });
    }

    res.status(200).json({
      message: "Staff deleted successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({
      message: "Failed to delete staff",
    });
  }
}

module.exports = {
  createStaff,
  getStaff,
  deleteStaff,
};
