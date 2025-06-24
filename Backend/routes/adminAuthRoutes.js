// routes/adminAuth.js
import express from 'express';
import {
  registerAdmin,
  verifyOtpAndSignup,
  loginAdmin
} from '../controllers/adminAuth.js';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/verify-otp', verifyOtpAndSignup);
router.post('/login', loginAdmin);

export default router;
