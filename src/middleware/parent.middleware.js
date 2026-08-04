const jwt = require("jsonwebtoken");

const authParent = (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {

    token = req.headers.authorization.split(" ")[1];

  }

  if (!token) {

    return res.status(401).json({
      success: false,
      message: "No token provided",
    });

  }

  try {

    /* ================= VERIFY ================= */
    const decoded = jwt.verify(
      token,
      process.env.JWT_PARENT_SECRET
    );

    req.parent = decoded;

    
    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid parent token",
    });

  }
};

module.exports = authParent;