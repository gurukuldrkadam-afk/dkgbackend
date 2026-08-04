const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: "",
    },

    parentemail: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    // OTP login fields
    otp: String,
    otpExpiry: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Parent", parentSchema);