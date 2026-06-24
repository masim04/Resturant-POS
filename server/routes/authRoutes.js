const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin, changePassword } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerAdmin);
router.post("/change-password", authMiddleware, changePassword);
router.post("/login", loginAdmin);

module.exports = router;