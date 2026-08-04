const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    year: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    fileId: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("images", imageSchema);