
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {API_URL} from '../config/env'
import PanchhiLogo from '../assets/images/PanchhiLogo.png';

interface RazorpayPaymentProps {
  amount: number;
  currency?: string;
  orderDetails: {
    productName: string;
    quantity: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
  };
  orderData: {
    items: any[];
    shippingAddress: any;
    totalAmount: number;
  };
  onPaymentSuccess: (paymentData: any) => void;
  onPaymentFailure: (error: any) => void;
}

// Declare Razorpay on window object
declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  currency = 'INR',
  orderDetails,
  orderData,
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const { toast } = useToast();
  const [isPaying, setIsPaying] = useState(false);
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsPaying(true); // Start loader

    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast({
        title: "Payment Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive",
      });
      setIsPaying(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/orders/create-razorpay-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!data.orderId) throw new Error("Order ID not returned");

      const options = {
        key: 'rzp_test_yG8q2YkQ1lvGsE',
        amount: data.amount,
        currency: data.currency,
        name: 'Panchhi Sarees',
        description: `Payment for ${orderDetails.productName}`,
        image: PanchhiLogo,
        order_id: data.orderId,
        handler: async function (response: any) {
          try {
            const token = localStorage.getItem('token');
            const verifyRes = await fetch(`${API_URL}/api/orders/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData,
              }),
            });

            if (verifyRes.ok) {
              const order = await verifyRes.json();
              toast({
                title: "Payment Successful!",
                description: `Order #${order._id} has been placed successfully.`,
              });
              onPaymentSuccess({ ...response, order });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            toast({
              title: "Payment Error",
              description: "Payment completed but order creation failed. Please contact support.",
              variant: "destructive",
            });
            onPaymentFailure(error);
          } finally {
            setIsPaying(false); // Stop loader
          }
        },
        prefill: {
          name: orderDetails.customerName,
          email: orderDetails.customerEmail,
          contact: orderDetails.customerPhone,
        },
        notes: {
          product: orderDetails.productName,
          quantity: orderDetails.quantity,
        },
        theme: { color: '#f15a59' },
        modal: {
          ondismiss: function () {
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled by user.",
              variant: "destructive",
            });
            setIsPaying(false); // Stop loader if user cancels
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive",
        });
        setIsPaying(false); // Stop loader on failure
        onPaymentFailure(response.error);
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      setIsPaying(false); // Stop loader on catch
      onPaymentFailure(error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isPaying}
      className={`w-full text-white flex items-center justify-center space-x-2 ${isPaying ? 'bg-[#d63031]' : 'bg-[#f15a59] hover:bg-[#d63031]'
        }`}
    >
      {isPaying ? (
        <>
          <Loader2 className="animate-spin w-4 h-4" />
          <span>Processing...</span>
        </>
      ) : (
        <>Pay ₹{amount.toLocaleString()}</>
      )}
    </Button>
  );
};

export default RazorpayPayment;
