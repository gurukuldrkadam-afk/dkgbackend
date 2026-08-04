const Student = require("../models/student.model");
const sendMail = require("../utils/sendMail");
const jwt = require("jsonwebtoken");

/* ================= TOKEN ================= */
const generateToken = (student) => {
  return jwt.sign(
    {
      studentId: student._id,
      studentUID: student.studentUID,
    },
    process.env.JWT_PARENT_SECRET,
    { expiresIn: "7d" }
  );
};


const sendOtp = async (req, res) => {
  try {

    const { studentUID } = req.body;

    if (!studentUID) {
      return res.status(400).json({
        success: false,
        message: "Student UID required",
      });
    }

    const student = await Student.findOne({
      studentUID,
      isActive: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.parent?.email) {
      return res.status(400).json({
        success: false,
        message: "Parent email not found",
      });
    }

    /* ---------- GENERATE OTP ---------- */
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    console.log("GENERATED OTP:", otp);

    /* ---------- SAVE OTP ---------- */
    student.otp = otp;

    student.otpExpiry =
      Date.now() + 6 * 60 * 1000;

    await student.save();

    console.log("SAVED OTP:", student.otp);

    /* ---------- SEND EMAIL ---------- */
    await sendMail(
      student.parent.email,
      "School Login OTP",
      `Hello ${student.parent.name || "Parent"},

Your OTP is: ${otp}

This OTP is valid for 6 minutes.

Student UID: ${student.studentUID}`
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {

    console.error("SEND OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


const verifyOtp = async (req, res) => {
  try {

    const { studentUID, otp } = req.body;

    if (!studentUID || !otp) {
      return res.status(400).json({
        success: false,
        message: "Student UID and OTP required",
      });
    }

    const student = await Student.findOne({
      studentUID,
      isActive: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

   console.log("DB OTP:", student.otp);
console.log("USER OTP:", otp);

if (String(student.otp) !== String(otp)) {
  return res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
}


    if (!student.otpExpiry ||
        student.otpExpiry < Date.now()) {

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });

    }

    student.otp = null;
    student.otpExpiry = null;

    await student.save();

    /* ---------- TOKEN ---------- */
    const token = generateToken(student);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      token,

      student: {
        id: student._id,
        studentUID: student.studentUID,
        name: student.name,
        parent: student.parent,
      },
    });

  } catch (error) {

    console.error("VERIFY OTP ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


const getParentProfile = async (req, res) => {
  try {

    const student = await Student.findById(
      req.student.studentId
    ).select("-otp -otpExpiry");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.json({
      success: true,
      student,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });

  }
};


const logoutParent = async (req, res) => {

  res.json({
    success: true,
    message: "Logged out successfully",
  });

};


module.exports = {
  sendOtp,
  verifyOtp,
  getParentProfile,
  logoutParent,
};