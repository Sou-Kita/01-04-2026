const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, password, email, fullName } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      fullName,
    });

    res
      .status(201)
      .json({
        message: "User created",
        user: { id: user._id, username, email, fullName },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
    res.json({
      token,
      user: {
        id: user._id,
        username,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
