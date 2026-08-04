const Disclosure = require("../models/disclosure.model");

/* ======================================================
   GET ALL
====================================================== */
const getSections = async (req, res) => {
  try {

    const sections = await Disclosure.find().sort({
      order: 1,
    });

    res.status(200).json(sections);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

/* ======================================================
   CREATE
====================================================== */
const createSection = async (req, res) => {
  try {

    const section = await Disclosure.create(req.body);

    res.status(201).json(section);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

/* ======================================================
   UPDATE
====================================================== */
const updateSection = async (req, res) => {
  try {

    const updated = await Disclosure.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updated);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

/* ======================================================
   DELETE
====================================================== */
const deleteSection = async (req, res) => {
  try {

    await Disclosure.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      message: "Deleted Successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

module.exports = {
  getSections,
  createSection,
  updateSection,
  deleteSection,
};