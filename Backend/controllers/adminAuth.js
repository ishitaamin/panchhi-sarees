// controllers/adminAuth.js
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import OTPModel from '../models/OTP.js';
import { sendOTPEmail } from '../utils/sendMail.js';
import generateToken from '../utils/generateToken.js';

export const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  const existing = await Admin.findOne({ $or: [{ email }, { username }] });
  if (existing) return res.status(400).json({ message: 'Admin exists' });

  const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
  await OTPModel.findOneAndUpdate(
    { email },
    {
      email,
      otp: otpValue,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true }
  );

  await sendOTPEmail(email, otpValue);
  res.json({ message: 'OTP sent to email' });
};

export const verifyOtpAndSignup = async (req, res) => {
  const { username, email, password, otp } = req.body;
  const record = await OTPModel.findOne({ email });
  if (!record || record.otp !== otp || record.expiresAt < new Date()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const admin = new Admin({ username, email, password: hashed, isVerified: true });
  await admin.save();
  await OTPModel.deleteOne({ email });

  res.json({ success: true });
};

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  if (!admin.isVerified) {
    return res.status(403).json({ message: 'Admin not verified' });
  }

  res.json({
    id: admin._id,
    username: admin.username,
    email: admin.email,
    token: generateToken(admin._id),
  });
};