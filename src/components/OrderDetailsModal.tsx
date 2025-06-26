
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details - #{order._id.slice(-8)}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-[#20283a] mb-2">Order Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.orderStatus === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                    order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                </p>
                <p><strong>Payment Status:</strong> 
                  <span className={`ml-2 ${order.isPaid ? 'text-green-600' : 'text-red-600'}`}>
                    {order.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </p>
                {order.paymentId && <p><strong>Payment ID:</strong> {order.paymentId}</p>}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-[#20283a] mb-2">Customer Information</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Name:</strong> {order.user?.name}</p>
                <p><strong>Email:</strong> {order.user?.email}</p>
                <p><strong>Phone:</strong> {order.user?.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="font-semibold text-[#20283a] mb-2">Shipping Address</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p>{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-[#20283a] mb-2">Order Items</h3>
            <div className="space-y-3">
              {order.orderItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg">
                  <img
                    src={item.image || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Quantity: {item.quantity}</p>
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                      <p>Price: ₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-xl font-bold text-[#f15a59]">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
