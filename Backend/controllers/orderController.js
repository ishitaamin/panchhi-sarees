import Order from "../models/Order.js";

export const placeOrder = async (req, res) => {
  const { orderItems, shippingAddress, totalAmount } = req.body;

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalAmount,
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate("orderItems.product");
  res.json(orders);
};
