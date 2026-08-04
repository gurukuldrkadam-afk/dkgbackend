const mongoose = require('mongoose');

const GoverningStaffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: ['governing', 'teaching', 'non-teaching'] 
    }
  },
  {
    timestamps: true
  }
);

const GoverningStaffModel = mongoose.model(
  'governingbody',
  GoverningStaffSchema
);

module.exports = GoverningStaffModel;
