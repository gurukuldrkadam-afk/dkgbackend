const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  let token;



  if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

 

  if (!token) {
    return res.status(401).json({
      isAdmin: false,
      message: "No token provided",
    });
  }

  try {

    if (!process.env.JWT_SECRET) {
      console.error("JWT SECRET is not defined");
      return res.status(500).json({
        isAdmin: false,
        message: "Server error",
      });
    }

 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* ================= ATTACH DATA ================= */

    req.adminId = decoded.id;
    req.isAdmin = decoded.isAdmin;


    next();

  } catch (err) {
    console.error("JWT verification failed:", err.message);

    return res.status(401).json({
      isAdmin: false,
      message: "Invalid token",
    });
  }
}

module.exports = authMiddleware;