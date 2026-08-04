const express = require("express");

const {
  createStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
  getStudentById
} = require("../controllers/student.controller");

const router = express.Router();

/* ROUTES */
router.post("/create", createStudent);
router.get("/all", getAllStudents);
router.get("/studentId", getStudentById);
router.put("/update/:studentId", updateStudent);
router.delete("/delete/:studentId", deleteStudent);

module.exports = router;