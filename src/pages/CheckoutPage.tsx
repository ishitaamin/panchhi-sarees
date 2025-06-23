import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const CheckoutPage = () => {
  const { items, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [showAddAddress, setShowAddAddress] = useState(false);

  const mockAddresses = [
    {
      id: 1,
      name: 'Home',
      address: '123 MG Road, Bangalore, Karnataka - 560001',
      phone: '+91 9876543210'
    },
    {
      id: 2,
      name: 'Office',
      address: '456 Brigade Road, Bangalore, Karnataka - 560025',
      phone: '+91 9876543210'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login to continue</h2>
          <Link to="/login">
            <Button className="bg-[#f15a59] hover:bg-[#d63031] text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <Link to="/">
            <Button className="bg-[#f15a59] hover:bg-[#d63031] text-white">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#20283a] mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#20283a]">Delivery Address</h2>
                <Button
                  onClick={() => setShowAddAddress(true)}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              </div>
              
              <div className="space-y-3">
                {mockAddresses.map((address, index) => (
                  <div
                    key={address.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedAddress === index
                        ? 'border-[#f15a59] bg-[#f15a59]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedAddress(index)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        checked={selectedAddress === index}
                        onChange={() => setSelectedAddress(index)}
                        className="mt-1 accent-[#f15a59]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <MapPin className="h-4 w-4 text-[#f15a59]" />
                          <span className="font-semibold">{address.name}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{address.address}</p>
                        <p className="text-gray-600 text-sm">{address.phone}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-[#20283a] mb-4">Order Items</h2>
              <div className="space-y-4">
                {items.map((item) => (
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
                  <span>₹{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{Math.round(getTotalPrice() * 0.18).toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{(getTotalPrice() + Math.round(getTotalPrice() * 0.18)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-[#f15a59] hover:bg-[#d63031] text-white mb-3">
                Place Order
              </Button>
              
              <Link to="/cart" className="block w-full">
                <Button variant="outline" className="w-full">
                  Back to Cart
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