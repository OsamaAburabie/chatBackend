const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  checkToken,
  searchUser,
  getUserById,
} = require("../controllers/userController");

const auth = require("../middlewares/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/check").post(auth, checkToken);
router.route("/search").get(auth, searchUser);
router.route("/zft/:id").get(getUserById);

module.exports = router;
