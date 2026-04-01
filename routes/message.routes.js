const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/message.controller");
const auth = require("../utils/authHandler");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

// GET messages với user
router.get("/:userID", auth.checkLogin, ctrl.getMessagesWithUser);

// POST message (text/file)
router.post(
  "/",
  auth.checkLogin,
  upload.fields([{ name: "file", maxCount: 1 }]),
  ctrl.createMessage
);

// GET last messages
router.get("/", auth.checkLogin, ctrl.getLastMessages);

module.exports = router;