import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken, getNameFromEmail } from "../utils/index.js";
import { sendEmail } from "../utils/sendEmail.js";
import { welcomeEmail } from "../emailTemplates/welcomeTemplate.js";
import jwt from "jsonwebtoken";
const logInWithGoogle = asyncHandler(async (req, res) => {
  const { name, email, sub } = req.user;
  const password = Date.now() + sub;
  console.log(req.user);
  // check if the user Exists
  const user = await User.findOne({ email });
  if (!user) {
    const newUser = User.create({
      name: name ? name : getNameFromEmail(email),
      email,
      password,
    });
    if (newUser) {
      // Generate Token
      const token = generateToken(newUser._id);
      // send HTTP to only cookie
      res.cookie("token", token, {
        path: "/",
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: process.env.SECURE,
      });
      const { _id, name, email, phone, role } = newUser;

      res.status(201).json({
        _id,
        name,
        email,
        phone,
        role,
        message: "Login Successfully",
      });
    }
  }
  // if the user exist login
  if (user) {
    // Generate Token
    const token = generateToken(user._id);
    // send HTTP to only cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: process.env.SECURE,
    });
    const { _id, name, email, phone, role } = user;
    // send welcome email to user
    const subject = "Welcome to Fullstack Template Project";
    const send_to = email;
    const template = welcomeEmail(name);
    const reply_to = "feisaladan2022@gmail.com";

    await sendEmail(subject, send_to, template, reply_to);

    res.status(201).json({
      _id,
      name,
      email,
      phone,
      role,
      message: "Login Successfully",
    });
  }
});

// logout user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    // maxAge: 30 * 24 * 60 * 60 * 1000,
    expires: new Date(0),
    sameSite: "none",
    secure: process.env.SECURE,
  });
  return res.status(200).json({ message: "Logout Successfully" });
});
// check login status of the user
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  // verify token
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});
// get user
const getUser = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
};
// get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort("-createdAt").select("-password");
  if (!users) {
    res.status(500);
    throw new Error("something went wrong");
  } else {
    res.status(200).json(users);
  }
});
// update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { name, email, phone } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      photo: updatedUser.photo,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// update photo
const updatePhoto = asyncHandler(async (req, res) => {
  const { photo } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.photo = photo;
  const updatedUser = await user.save();
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    phone: updatedUser.phone,
    photo: updatedUser.photo,
    role: updatedUser.role,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not");
  }
  await User.findByIdAndDelete(id);
  res.status(200).json({
    message: "User deleted successfully",
  });
});

// change user role
const changeUserRole = asyncHandler(async (req, res) => {
  const { role, id } = req.body;
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.role = role;
  await user.save();
  res.status(200).json({
    message: `User role updated to ${role}`,
  });
});
export {
  logInWithGoogle,
  logoutUser,
  loginStatus,
  getUser,
  getUsers,
  updateUser,
  updatePhoto,
  deleteUser,
  changeUserRole,
};
