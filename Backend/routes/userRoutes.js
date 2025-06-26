import express from "express";
import {
  getProfile,
  toggleWishlist,
  addAddress,
  getAddresses,
  editAddress,
  deleteAddress,
  getCartItems,
  addOrUpdateCart,
  removeCartItem
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getProfile);
router.post("/wishlist", protect, toggleWishlist);
router.post("/address", protect, addAddress);
router.get("/address", protect, getAddresses);
router.put("/address", protect, editAddress);
router.delete("/address", protect, deleteAddress);
router.get("/cart", protect, getCartItems);
router.post("/cart", protect, addOrUpdateCart);
router.delete("/cart", protect, removeCartItem);

export default router;