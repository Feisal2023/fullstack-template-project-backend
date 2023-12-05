import express from "express";
import {
  changeUserRole,
  deleteUser,
  getUser,
  getUsers,
  logInWithGoogle,
  loginStatus,
  logoutUser,
  updatePhoto,
  updateUser,
} from "../controllers/userController.js";
import decodeToken from "../middlewares/firebaseMiddleware.js";
import { adminOnly, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/google/callback", decodeToken, logInWithGoogle);
router.get("/logout", logoutUser);
router.get("/loginStatus", loginStatus);
router.get("/getUser", protect, getUser);
router.get("/getUsers", protect, adminOnly, getUsers);
router.patch("/updateUser", protect, updateUser);
router.patch("/updatePhoto", protect, updatePhoto);
router.delete("/:id", protect, adminOnly, deleteUser);
router.post("/changeUserRole", protect, adminOnly, changeUserRole);
export default router;
