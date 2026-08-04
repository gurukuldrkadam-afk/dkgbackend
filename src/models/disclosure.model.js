const mongoose = require("mongoose");

/* ======================================================
   ROW
====================================================== */
const RowSchema = new mongoose.Schema(
  {
    values: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

/* ======================================================
   TABLE
====================================================== */
const TableSchema = new mongoose.Schema(
  {
    title: String,

    headers: {
      type: [String],
      default: [],
    },

    documentColumn: {
      type: Number,
      default: -1,
    },

    rows: [RowSchema],
  },
  { _id: false }
);

/* ======================================================
   SECTION
====================================================== */
const SectionSchema = new mongoose.Schema(
  {
    title: String,

    order: {
      type: Number,
      default: 0,
    },

    tables: [TableSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "DisclosureSection",
  SectionSchema
);