
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
        handler: async function (response: any) {
          try {
            // Verify payment and create order
            const token = localStorage.getItem('token');
            const verifyRes = await fetch('http://localhost:5000/api/orders/verify-payment', {
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
