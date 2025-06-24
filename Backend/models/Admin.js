// models/Admin.js
import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Admin', adminSchema);