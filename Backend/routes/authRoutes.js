import express from "express";
import {
  registerUser,
  verifyOtpAndCreateUser,
  loginUser
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyOtpAndCreateUser);
router.post("/login", loginUser);

export default router;