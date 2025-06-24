// utils/sendMail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
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