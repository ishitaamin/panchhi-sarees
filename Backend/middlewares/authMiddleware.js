import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect route middleware
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.warn("⚠️ Authorization header missing or malformed");
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.warn("🚫 User not found for decoded ID");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error);
    return res.status(401).json({ message: "Token failed or invalid" });
  }
};

// Admin-only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    console.warn(`🚫 Admin access denied for user: ${req.user?.email || "unknown"}`);
    res.status(403).json({ message: "Admin access only" });
  }
};