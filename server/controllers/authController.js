const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (ONCE) MAYBE I WILL USE IT TO CHANGE PASSWORD LATERRRRRR
const registerAdmin = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const admin = await Admin.create({
      username: req.body.username,
      password: hashedPassword
    });

    res.json(admin);
  } catch (err) {
    res.status(500).json(err);
  }
};
// CHANGE PASSWORD
const changePassword = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);
    const isMatch = await bcrypt.compare(req.body.oldPassword, admin.password);

  if (!admin) return res.status(404).json({ error: "Admin not found" });
if (!isMatch) return res.status(400).json({ error: "Invalid old password" });

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json("Password changed successfully");
  }catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}
// LOGIN
const loginAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.body.username });

    if (!admin) return res.status(400).json({ error: "Invalid username" });

    const isMatch = await bcrypt.compare(req.body.password, admin.password);

    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { registerAdmin, loginAdmin, changePassword };