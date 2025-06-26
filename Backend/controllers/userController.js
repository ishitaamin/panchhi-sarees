import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate({
        path: "wishlist",
        select: "name image price category"
      })
      .populate({
        path: "cart.product",
        select: "name image price category"
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      isVerified: user.isVerified,
      wishlist: user.wishlist,
      cart: user.cart,
      addresses: user.addresses,
      createdAt: user.createdAt,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Helper function to map addresses with id
const mapAddressWithId = (addr) => ({
  id: addr._id.toString(),
  fullName: addr.fullName,
  phone: addr.phone,
  addressLine1: addr.addressLine1,
  addressLine2: addr.addressLine2,
  city: addr.city,
  state: addr.state,
  pincode: addr.pincode,
  country: addr.country,
  isDefault: addr.isDefault,
});

// POST: /users/address
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const {
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    pincode,
    country,
    isDefault,
  } = req.body;

  if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
    return res.status(400).json({ error: "Missing required address fields" });
  }

  if (isDefault) {
    user.addresses.forEach(addr => (addr.isDefault = false));
  }

  const newAddress = {
    fullName,
    phone,
    addressLine1,
    addressLine2: addressLine2 || "",
    city,
    state,
    pincode,
    country: country || "India",
    isDefault: !!isDefault,
  };

  user.addresses.push(newAddress);
  await user.save();

  res.status(201).json({
    success: true,
    addresses: user.addresses.map(mapAddressWithId),
  });
});

// PUT: /users/address
export const editAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { id, updatedAddress } = req.body;

  if (!id || !updatedAddress) {
    return res.status(400).json({
      error: "Address id and updatedAddress are required",
    });
  }

  // Find address by id
  const addrIndex = user.addresses.findIndex(addr => addr._id.toString() === id);
  if (addrIndex === -1) {
    return res.status(404).json({ error: "Address not found" });
  }

  if (updatedAddress.isDefault) {
    user.addresses.forEach((addr, i) => {
      if (i !== addrIndex) addr.isDefault = false;
    });
  }

  // Update address fields, keep _id intact
  user.addresses[addrIndex] = {
    fullName: updatedAddress.fullName,
    phone: updatedAddress.phone,
    addressLine1: updatedAddress.addressLine1,
    addressLine2: updatedAddress.addressLine2 || "",
    city: updatedAddress.city,
    state: updatedAddress.state,
    pincode: updatedAddress.pincode,
    country: updatedAddress.country || "India",
    isDefault: !!updatedAddress.isDefault,
    _id: user.addresses[addrIndex]._id,
  };

  await user.save();

  res.json({
    success: true,
    addresses: user.addresses.map(mapAddressWithId),
  });
});

// GET: /users/address
export const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    addresses: user.addresses.map(mapAddressWithId),
  });
});

// DELETE: /users/address
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Address id is required" });
  }

  // Find address by id
  const addrIndex = user.addresses.findIndex(addr => addr._id.toString() === id);
  if (addrIndex === -1) {
    return res.status(404).json({ error: "Address not found" });
  }

  user.addresses.splice(addrIndex, 1);
  await user.save();

  res.json({
    success: true,
    addresses: user.addresses.map(mapAddressWithId),
  });
});

// POST: /users/wishlist
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { productId } = req.body;

  if (!productId) return res.status(400).json({ error: "Product ID is required" });

  const productObjectId = new mongoose.Types.ObjectId(productId);

  const index = user.wishlist.findIndex((id) => id.equals(productObjectId));

  if (index > -1) {
    user.wishlist.splice(index, 1);
  } else {
    user.wishlist.push(productObjectId);
  }

  await user.save();

  const updatedUser = await User.findById(req.user._id).populate("wishlist", "name image price category");

  res.json({ success: true, wishlist: updatedUser.wishlist });
});

export const getCartItems = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    cart: user.cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size,
    })),
  });
});

export const addOrUpdateCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size } = req.body;

  if (!productId || !size || typeof quantity !== "number") {
    return res.status(400).json({ error: "Product ID, size, and quantity are required" });
  }

  const user = await User.findById(req.user._id);
  const existingIndex = user.cart.findIndex(
    item => item.product.toString() === productId && item.size === size
  );

  if (existingIndex > -1) {
    user.cart[existingIndex].quantity = quantity;
  } else {
    user.cart.push({ product: productId, quantity, size });
  }

  await user.save();
  await user.populate("cart.product");

  res.json({
    success: true,
    cart: user.cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size,
    })),
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId, size } = req.body;

  if (!productId || !size) {
    return res.status(400).json({ error: "Product ID and size are required" });
  }

  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(
    item => !(item.product.toString() === productId && item.size === size)
  );

  await user.save();
  await user.populate("cart.product");

  res.json({
    success: true,
    cart: user.cart.map(item => ({
      product: item.product,
      quantity: item.quantity,
      size: item.size,
    })),
  });
});

export const clearCart = async (req, res) => {
  try {
    const user = req.user; // from protect middleware
    user.cart = []; // clear the cart array
    await user.save();
    res.status(200).json({ message: "Cart cleared successfully", cart: user.cart });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};