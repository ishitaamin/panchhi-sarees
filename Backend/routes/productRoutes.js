import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, upload.single("image"), createProduct);
router.put("/:id", protect, adminOnly, upload.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;