
import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  allowEditing?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({ allowEditing = true }) => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      fullName: 'John Doe',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      isDefault: true
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleAddAddress = () => {
    setShowAddForm(true);
    setEditingAddress(null);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
  };

  const handleSaveAddress = (addressData: Omit<Address, 'id'>) => {
    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id 
          ? { ...addressData, id: editingAddress.id }
          : addr
      ));
    } else {
      // Add new address
      const newAddress: Address = {
        ...addressData,
        id: Date.now().toString()
      };
      setAddresses([...addresses, newAddress]);
    }
    setShowAddForm(false);
    setEditingAddress(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#20283a]">Saved Addresses</h2>
        {allowEditing && (
          <Button 
            onClick={handleAddAddress}
            className="bg-[#f15a59] hover:bg-[#d63031] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No addresses saved yet</p>
          {allowEditing && (
            <Button 
              onClick={handleAddAddress}
              className="mt-4 bg-[#f15a59] hover:bg-[#d63031] text-white"
            >
              Add Your First Address
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-[#20283a]">{address.fullName}</h3>
                    {address.isDefault && (
                      <span className="bg-[#f15a59] text-white text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-gray-600 text-sm">{address.country}</p>
                </div>
                
                {allowEditing && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveAddress({
                fullName: formData.get('fullName') as string,
                addressLine1: formData.get('addressLine1') as string,
                addressLine2: formData.get('addressLine2') as string || undefined,
                city: formData.get('city') as string,
                state: formData.get('state') as string,
                pincode: formData.get('pincode') as string,
                country: formData.get('country') as string,
                isDefault: formData.get('isDefault') === 'on'
              });
            }}>
              <div className="space-y-4">
                <input
                  name="fullName"
                  type="text"
                  placeholder="Full Name"
                  defaultValue={editingAddress?.fullName || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                  required
                />
                <input
                  name="addressLine1"
                  type="text"
                  placeholder="Address Line 1"
                  defaultValue={editingAddress?.addressLine1 || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                  required
                />
                <input
                  name="addressLine2"
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  defaultValue={editingAddress?.addressLine2 || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="city"
                    type="text"
                    placeholder="City"
                    defaultValue={editingAddress?.city || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                    required
                  />
                  <input
                    name="state"
                    type="text"
                    placeholder="State"
                    defaultValue={editingAddress?.state || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    name="pincode"
                    type="text"
                    placeholder="Pincode"
                    defaultValue={editingAddress?.pincode || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                    required
                  />
                  <input
                    name="country"
                    type="text"
                    placeholder="Country"
                    defaultValue={editingAddress?.country || 'India'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                    required
                  />
                </div>
                <label className="flex items-center">
                  <input
                    name="isDefault"
                    type="checkbox"
                    defaultChecked={editingAddress?.isDefault || false}
                    className="rounded border-gray-300 text-[#f15a59] focus:ring-[#f15a59]"
                  />
                  <span className="ml-2 text-sm text-gray-600">Set as default address</span>
                </label>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#f15a59] hover:bg-[#d63031] text-white"
                >
                  {editingAddress ? 'Update' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressManager;
