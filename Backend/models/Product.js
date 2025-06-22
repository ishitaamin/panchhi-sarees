import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  quantity: { type: Number, required: true },
  fabric: { type: String },
  rating: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
