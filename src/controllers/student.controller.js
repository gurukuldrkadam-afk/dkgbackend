const Student = require("../models/student.model");


const generateStudentUID = (studentClass, roll) => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  const classCode = studentClass.replace("Grade ", "G").replace(" ", "");
  return `DKG-${classCode}-${roll}-${random}`;
};


const createStudent = async (req, res) => {
  try {

    console.log("BODY:", req.body);

    const {
      name,
      class: studentClass,
      section,
      roll,

      total,
      paid,

      parentName,
      parentEmail,
      parentemail,
      parentPhone,

      parent,
      fees,

    } = req.body;

    /* ---------- VALIDATION ---------- */
    if (!name || !studentClass || !section || !roll) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* ---------- DUPLICATE CHECK ---------- */
    const existing = await Student.findOne({
      class: studentClass,
      section,
      roll,
      isActive: true,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Student already exists in this class/section with same roll",
      });
    }

    /* ---------- UID ---------- */
    const studentUID = generateStudentUID(studentClass, roll);

    /* ---------- PARENT DATA ---------- */
    const finalParent = {
      name:
        parent?.name ||
        parentName ||
        "",

      email:
        parent?.email ||
        parentEmail ||
        parentemail ||
        "",

      phone:
        parent?.phone ||
        parentPhone ||
        "",
    };

    const finalFees = {
      total:
        fees?.total ||
        total ||
        0,

      paid:
        fees?.paid ||
        paid ||
        0,
    };

    finalFees.pending =
      finalFees.total - finalFees.paid;

    const student = await Student.create({
      name,
      class: studentClass,
      section,
      roll,
      studentUID,

      parent: finalParent,
      fees: finalFees,

      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      studentUID,
      student,
    });

  } catch (error) {
    console.error("CREATE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ isActive: true }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: students.length,
      students,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================================
   GET BY CLASS
========================================================= */
const getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.query;

    const students = await Student.find({
      class: className,
      isActive: true,
    });

    res.json({
      success: true,
      students,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================================
   GET SINGLE STUDENT
========================================================= */
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student || !student.isActive) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      student,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const loginStudent = async (req, res) => {
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
        message: "Invalid UID",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      student,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================================
   UPDATE STUDENT
========================================================= */
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student || !student.isActive) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const {
      name,
      class: studentClass,
      section,
      roll,
      total,
      paid,
      parentName,
      parentEmail,
      parentPhone,
    } = req.body;

    if (name) student.name = name;
    if (studentClass) student.class = studentClass;
    if (section) student.section = section;
    if (roll) student.roll = roll;

    if (parentName) student.parent.name = parentName;
    if (parentEmail) student.parent.email = parentEmail;
    if (parentPhone) student.parent.phone = parentPhone;

    if (total !== undefined) student.fees.total = total;
    if (paid !== undefined) student.fees.paid = paid;

    student.fees.pending = student.fees.total - student.fees.paid;

    if (student.fees.pending < 0) {
      return res.status(400).json({
        success: false,
        message: "Paid cannot exceed total",
      });
    }

    await student.save();

    res.json({
      success: true,
      message: "Student updated successfully",
      student,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    student.isActive = false;
    await student.save();

    res.json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = {
  createStudent,
  getAllStudents,
  getStudentsByClass,
  getStudentById,
  loginStudent,
  updateStudent,
  deleteStudent,
};