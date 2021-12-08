const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

const registerUser = async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Please Enter All Fields",
    });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({
      message: "User not created",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please Enter Email And Password",
    });
  }

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
};
const checkToken = async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    valid: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    isAdmin: user.isAdmin,
  });
};

const searchUser = async (req, res) => {
  const { userEmail } = req.body;
  const user = await User.findOne({
    $or: [{ email: { $regex: userEmail, $options: "i" } }],
  });

  if (!user || user._id == req.userId) {
    return res.status(200).json({
      message: "No user found",
    });
  } else {
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }

  return res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    pic: user.pic,
    isAdmin: user.isAdmin,
  });
};

module.exports = {
  registerUser,
  loginUser,
  checkToken,
  searchUser,
  getUserById,
};
