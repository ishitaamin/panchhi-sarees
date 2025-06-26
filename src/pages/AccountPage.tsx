import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, MapPin, ShoppingBag, Heart, Settings, LogOut, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import AddressManager from '@/components/AddressManager';
import axios from 'axios';

const AccountPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Early return for authentication check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your account</h2>
          <Link to="/login">
            <Button className="bg-[#f15a59] hover:bg-[#d63031] text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('http://localhost:5000/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          setUserOrders(res.data);
          setError('');
        })
        .catch((err) => {
          console.error('Error fetching orders:', err);
          setError('Failed to load orders');
        })
        .finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
        setError('Authentication required');
      }
    }
  }, [isAuthenticated, activeTab]);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-t-transparent border-[#f15a59] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#20283a] mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-[#f15a59] rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-[#20283a]">{user?.name}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#f15a59] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#20283a] mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={user?.name || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={user?.phone || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
                      />
                    </div>
                    <Button className="bg-[#f15a59] hover:bg-[#d63031] text-white">
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#20283a] mb-6">My Orders</h2>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <div className="w-8 h-8 border-4 border-t-transparent border-[#f15a59] rounded-full animate-spin"></div>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button 
                        onClick={() => setActiveTab('orders')}
                        className="bg-[#f15a59] hover:bg-[#d63031] text-white"
                      >
                        Retry
                      </Button>
                    </div>
                  ) : userOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">No orders yet</p>
                      <Link to="/">
                        <Button className="mt-4 bg-[#f15a59] hover:bg-[#d63031] text-white">
                          Start Shopping
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order: any) => (
                        <div key={order._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-semibold text-[#20283a]">Order #{order._id.slice(-8)}</h3>
                              <p className="text-sm text-gray-600">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{order.totalAmount.toLocaleString()}</p>
                              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.orderStatus === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                                order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {order.orderItems.map((item: any, index: number) => (
                              <div key={index} className="flex items-center space-x-3 py-2 border-t border-gray-100 first:border-t-0">
                                <img
                                  src={item.image || 'https://via.placeholder.com/50'}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">{item.name}</h4>
                                  <p className="text-xs text-gray-600">
                                    Qty: {item.quantity} {item.size && `• Size: ${item.size}`}
                                  </p>
                                </div>
                                <p className="font-semibold text-sm">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                              <strong>Shipping Address:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'addresses' && (
                <div>
                  <AddressManager allowEditing={true} />
                </div>
              )}
              
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#20283a] mb-6">My Wishlist</h2>
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600">Your wishlist is empty</p>
                      <Link to="/">
                        <Button className="mt-4 bg-[#f15a59] hover:bg-[#d63031] text-white">
                          Browse Products
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistItems.map((item) => (
                        <div key={item._id} className="border rounded-lg p-4 relative">
                          <button
                            onClick={() => removeFromWishlist(item._id)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <Link to={`/product/${item._id}`}>
                            <img
                              src={item.image || 'https://via.placeholder.com/200'}
                              alt={item.name}
                              className="w-full h-40 object-cover rounded mb-2"
                            />
                            <h3 className="font-medium text-[#20283a] mb-1 line-clamp-2">{item.name}</h3>
                            <p className="text-[#f15a59] font-semibold">₹{item.price.toLocaleString()}</p>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold text-[#20283a] mb-6">Settings</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Notifications</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-[#f15a59] focus:ring-[#f15a59]" />
                          <span className="ml-2 text-sm text-gray-600">Email notifications</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-[#f15a59] focus:ring-[#f15a59]" />
                          <span className="ml-2 text-sm text-gray-600">SMS notifications</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">Privacy</h3>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" className="rounded border-gray-300 text-[#f15a59] focus:ring-[#f15a59]" />
                          <span className="ml-2 text-sm text-gray-600">Allow data collection for better experience</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
