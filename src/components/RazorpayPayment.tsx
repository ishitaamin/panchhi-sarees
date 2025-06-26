import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
  onPaymentSuccess,
  onPaymentFailure
}) => {
  const { toast } = useToast();

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
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      toast({
        title: "Payment Error",
        description: "Failed to load payment gateway. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // 1. Create order on backend
    try {
      const res = await fetch('http://localhost:5000/api/orders/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!data.orderId) {
        throw new Error("Order ID not returned");
      }

      const options = {
        key: 'rzp_test_yG8q2YkQ1lvGsE',
        amount: data.amount,
        currency: data.currency,
        name: 'Panchhi Sarees',
        description: `Payment for ${orderDetails.productName}`,
        image: '/assets/images/PanchhiLogo.png',
        order_id: data.orderId,
        handler: function (response: any) {
          toast({
            title: "Payment Successful!",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          onPaymentSuccess(response);
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
        onPaymentFailure(response.error);
      });

      razorpay.open();
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      onPaymentFailure(error);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      className="w-full bg-[#f15a59] hover:bg-[#d63031] text-white"
    >
      Pay ₹{amount.toLocaleString()}
    </Button>
  );
};

export default RazorpayPayment;