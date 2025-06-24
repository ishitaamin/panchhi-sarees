import bcrypt from "bcryptjs";
import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { sendOTPEmail } from "../utils/sendMail.js";
import generateToken from "../utils/generateToken.js";

// STEP 1: Register with OTP
export const registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { phone }] });
  if (userExists) return res.status(400).json({ message: "User with email or phone already exists" });

  const otpValue = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedPassword = await bcrypt.hash(password, 10);

  await OTP.findOneAndUpdate(
    { email },
    {
      email,
      otp: otpValue,
      name,
      phone,
      password: hashedPassword,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
    { upsert: true }
  );

  await sendOTPEmail(email, otpValue);
  res.status(200).json({ message: "OTP sent to email" });
};

// STEP 2: Verify OTP and Create User
export const verifyOtpAndCreateUser = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email });
  if (!record) {
    return res.status(400).json({ message: "No OTP found for this email." });
  }
  if (record.otp !== otp) {
    return res.status(400).json({ message: "Incorrect OTP." });
  }
  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired. Please request a new one." });
  }

  const user = new User({
    name: record.name,
    email: record.email,
    phone: record.phone,
    password: record.password,
    isVerified: true,
  });

  await user.save();
  await OTP.deleteOne({ email });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
  });
};

// STEP 3: Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  if (!user.isVerified) {
    return res.status(403).json({ message: "User not verified. Please complete OTP verification." });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    token: generateToken(user._id),
  });
};