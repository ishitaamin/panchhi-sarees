import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AddressForm, { Address } from '@/components/AddressForm';
import RazorpayPayment from '@/components/RazorpayPayment';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Get buy now product from location state
  const buyNowProduct = location.state?.buyNowProduct;
  const checkoutItems = buyNowProduct ? [buyNowProduct] : items;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to continue</h2>
          <Link to="/login">
            <Button className="bg-[#f15a59] hover:bg-[#d63031] text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <Link to="/category/all">
            <Button className="bg-[#f15a59] hover:bg-[#d63031] text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getItemsTotal = () => {
    return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const totalAmount = getItemsTotal() + Math.round(getItemsTotal() * 0.18);

  const handlePaymentSuccess = async (paymentData: any) => {
    console.log('Payment successful:', paymentData);

    if (!buyNowProduct) {
      await clearCart(); // Ensure it runs fully
    }

    navigate('/');
  };

  const handlePaymentFailure = (error: any) => {
    console.log('Payment failed:', error);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#20283a] mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <AddressForm onAddressSelect={setSelectedAddress} showSelection={true} allowEditing={true} />
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#20283a] mb-4">Order Items</h2>
              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#20283a]">{item.name}</h3>
                      <div className="text-sm text-gray-600">
                        {item.size && <span>Size: {item.size} </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <p className="text-sm">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-[#20283a] mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getItemsTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (GST: 18%)</span>
                  <span>₹{Math.round(getItemsTotal() * 0.18).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {selectedAddress && user ? (
                <RazorpayPayment
                  amount={totalAmount}
                  orderDetails={{
                    productName: checkoutItems.length === 1 ? checkoutItems[0].name : `${checkoutItems.length} items`,
                    quantity: checkoutItems.reduce((sum, item) => sum + item.quantity, 0),
                    customerName: user.name,
                    customerEmail: user.email,
                    customerPhone: user.phone || selectedAddress.phone,
                  }}
                  orderData={{
                    items: checkoutItems.map(item => ({
                      product: item.id,
                      quantity: item.quantity,
                      size: item.size,
                      color: item.color,
                      price: item.price,
                      name: item.name,
                      image: item.image,
                    })),
                    shippingAddress: selectedAddress,
                    totalAmount: totalAmount,
                  }}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentFailure={handlePaymentFailure}
                />
              ) : (
                <div className="text-center text-gray-500 mb-3">
                  Please select a delivery address to proceed
                </div>
              )}

              <Link to={buyNowProduct ? `/product/${buyNowProduct.id}` : "/cart"} className="block w-full mt-3">
                <Button variant="outline" className="w-full">
                  {buyNowProduct ? 'Back to Product' : 'Back to Cart'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
