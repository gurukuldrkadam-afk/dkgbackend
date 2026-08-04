const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({

  name: String,
  class: String,
  section: String,
  roll: String,

  studentUID: {
    type: String,
    unique: true,
  },

  photo: String,

  parent: {
    name: String,
    email: String,
    phone: String,
  },

  fees: {
    total: Number,
    paid: Number,
    pending: Number,
  },

 
  otp: {
    type: String,
    default: null,
  },

  otpExpiry: {
    type: Date,
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

}, {
  timestamps: true,
});

module.exports = mongoose.model("Student", studentSchema);