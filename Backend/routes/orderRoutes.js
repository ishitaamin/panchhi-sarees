
import express from "express";
import { placeOrder, getMyOrders, getAllOrders, createRazorpayOrder, verifyPayment, updateOrderStatus } from "../controllers/orderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.get("/all", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-payment", protect, verifyPayment);

export default router;
