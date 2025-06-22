import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, createProduct);
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;