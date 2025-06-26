
// utils/sendMail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: '"Panchhi Sarees" <bhandaridhyeyh@gmail.com>',
      to: email,
      subject: "OTP Verification for Account Signup",
      text: `Hi,\n\nYour OTP is: ${otp}\n\nIt is valid for 10 minutes.\n\nRegards,\nPanchhi Sarees`,
      html: `<p>Hi,</p><p>Your OTP is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p><p>Regards,<br/>Panchhi Sarees</p>`,
    });
  } catch (error) {
    console.error('❌ Failed to send OTP email:', error);
    throw new Error('Email sending failed');
  }
}

export async function sendOrderShippedEmail(email, order) {
  try {
    const orderItemsHtml = order.orderItems.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">₹${item.price.toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f15a59; text-align: center;">Your Order Has Been Shipped!</h2>
        
        <p>Hi ${order.user.name},</p>
        
        <p>Great news! Your order <strong>#${order._id.slice(-8)}</strong> has been shipped and is on its way to you.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #20283a;">Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f15a59; color: white;">
                <th style="padding: 10px; text-align: left;">Image</th>
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItemsHtml}
            </tbody>
          </table>
          <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #f15a59;">
            <strong style="font-size: 18px;">Total: ₹${order.totalAmount.toLocaleString()}</strong>
          </div>
        </div>
        
        <div style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #20283a;">Shipping Address:</h3>
          <p style="margin: 5px 0;">${order.shippingAddress.fullName}</p>
          <p style="margin: 5px 0;">${order.shippingAddress.addressLine1}</p>
          ${order.shippingAddress.addressLine2 ? `<p style="margin: 5px 0;">${order.shippingAddress.addressLine2}</p>` : ''}
          <p style="margin: 5px 0;">${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}</p>
          <p style="margin: 5px 0;">${order.shippingAddress.country}</p>
        </div>
        
        <p>Your order should arrive within 3-7 business days. We'll send you tracking information once it's available.</p>
        
        <p>Thank you for choosing Panchhi Sarees!</p>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f15a59; color: white; border-radius: 8px;">
          <p style="margin: 0;">For any questions, contact us at <a href="mailto:bhandaridhyeyh@gmail.com" style="color: white;">bhandaridhyeyh@gmail.com</a></p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: '"Panchhi Sarees" <bhandaridhyeyh@gmail.com>',
      to: email,
      subject: `Order Shipped - #${order._id.slice(-8)} | Panchhi Sarees`,
      html: html,
    });
  } catch (error) {
    console.error('❌ Failed to send order shipped email:', error);
    throw new Error('Order shipped email sending failed');
  }
}
