const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
  sendMessage,
  deleteMessage,
  getSingleTargetInfo,
  getAllMessages,
} = require("../controllers/messageController");

router.route("/").post(auth, sendMessage);
router.route("/:chatId").get(auth, getSingleTargetInfo);
router.route("/getAllMessages/:chatId").get(auth, getAllMessages);
router.route("/").delete(auth, deleteMessage);

module.exports = router;
