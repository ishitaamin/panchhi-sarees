import express from "express";
import { placeOrder, getMyOrders, createRazorpayOrder } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, placeOrder);
router.get("/my", protect, getMyOrders);
router.post("/create-razorpay-order", createRazorpayOrder);

export default router;