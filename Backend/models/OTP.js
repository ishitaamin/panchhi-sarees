// models/OTP.js
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email:     { type: String, required: true },
  otp:       { type: String, required: true },
  expiresAt: { type: Date, required: true },
  name:      { type: String, required: true },
  phone:     { type: String, required: true },
  password:  { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('OTP', otpSchema);