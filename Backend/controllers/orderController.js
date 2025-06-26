
import Order from "../models/Order.js";
import Razorpay from "razorpay";
import { sendOrderShippedEmail } from "../utils/sendMail.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR" } = req.body;

    const options = {
      amount: amount * 100, // in paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, currency: order.currency, amount: order.amount });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      razorpay_signature,
      orderData 
    } = req.body;

    // Verify payment signature
    const crypto = await import('crypto');
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // Create order in database
    const order = new Order({
      user: req.user._id,
      orderItems: orderData.items,
      shippingAddress: orderData.shippingAddress,
      totalAmount: orderData.totalAmount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      isPaid: true,
      paidAt: new Date(),
    });

    const createdOrder = await order.save();
    await createdOrder.populate("orderItems.product user");
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "Failed to verify payment" });
  }
};

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
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("orderItems.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("orderItems.product user")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    ).populate("orderItems.product user");
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Send email notification when order is shipped
    if (status === 'shipped' && order.user?.email) {
      try {
        await sendOrderShippedEmail(order.user.email, order);
        console.log('✅ Order shipped email sent to:', order.user.email);
      } catch (emailError) {
        console.error('❌ Failed to send order shipped email:', emailError);
        // Continue with the response even if email fails
      }
    }
    
    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
};
