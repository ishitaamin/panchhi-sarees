import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: String,
  phone: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  pincode: String,
  country: String,
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  size: { type: String, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },

    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [cartItemSchema],
    addresses: [addressSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);