const express = require('express');
const authController = require("../controllers/auth.controller");
const authMiddleware =require("../middleware/auth.middleware")

const router = express.Router();

router.post('/admin/login',authController.loginAdmin);
router.post('/admin/logout', authController.logoutAdmin);
router.post('/admin/register',authController.registerAdmin);

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    isAdmin: req.isAdmin === true
  });
});

module.exports = router;



module.exports= router;
