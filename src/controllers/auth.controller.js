const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin.model");


async function registerAdmin(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await adminModel.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await adminModel.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        isAdmin: true,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({
  message: "Admin Logged in successfully",
  token,                // ✅ send token
  isAdmin: true,        // ✅ explicit flag
  admin: {
    _id: admin._id,
    email: admin.email,
    fullName: admin.fullName
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}


function checkAdmin(req, res) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ isAdmin: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      isAdmin: decoded.isAdmin === true,
    });
  } catch (err) {
    return res.json({ isAdmin: false });
  }
}


function logoutAdmin(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}

module.exports = {
  registerAdmin,
  loginAdmin,
  checkAdmin,
  logoutAdmin,
};
