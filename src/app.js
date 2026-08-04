const express = require("express");
const cors = require("cors");

const studentRoutes = require("./routes/students.routes");
const parentRoutes = require("./routes/parent.routes");
const authRoutes = require("./routes/auth.routes");
const staffRoutes = require("./routes/staff.routes");
const governingRoutes = require("./routes/governing.routes");
const imageRoutes = require("./routes/image.routes");
const noticeRoutes = require("./routes/notice.routes");
const disclosureRoutes = require("./routes/disclosure.routes");


const app = express();

/* ================= ALLOWED ORIGINS ================= */

const allowedOrigins = [
  "https://drkadamgurukul.in/",
  "http://drkadamgurukul.in/",
  "http://localhost:5173",
];

/* ================= CORS ================= */

app.use(
  cors({
    origin: function (origin, callback) {

      /* POSTMAN OR MOBILE APPS */
      if (!origin) {
        return callback(null, true);
      }

      /* CHECK FRONTEND URL */
      if (allowedOrigins.indexOf(origin) === -1) {

        return callback(
          new Error("CORS Not Allowed"),
          false
        );
      }

      return callback(null, true);
    },

    credentials: true,
  })
);

/* ================= BODY MIDDLEWARE ================= */

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

/* ================= HEALTH ROUTE ================= */

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

/* ================= ROUTES ================= */

app.use(
  "/api/disclosure",
  disclosureRoutes
);
app.use("/api/student", studentRoutes);

app.use("/api/parent", parentRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/staff", staffRoutes);

app.use("/api/governing", governingRoutes);

app.use("/api/notice", noticeRoutes);

app.use("/api/image", imageRoutes);

/* ================= GLOBAL ERROR ================= */

app.use((err, req, res, next) => {

  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message:
      err.message || "Internal Server Error",
  });

});

module.exports = app;