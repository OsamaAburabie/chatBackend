const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { createChat, fetchChats } = require("../controllers/chatController");

router.route("/").post(auth, createChat);
router.route("/").get(auth, fetchChats);

module.exports = router;
