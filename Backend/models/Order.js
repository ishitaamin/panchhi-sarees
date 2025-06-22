import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, required: true },
    }
  ],
  shippingAddress: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
