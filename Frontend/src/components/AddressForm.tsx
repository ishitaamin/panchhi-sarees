import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressFormProps {
  onAddressSelect?: (address: Address) => void;
  showSelection?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ onAddressSelect, showSelection = false }) => {
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem('userAddresses');
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    const defaultAddress = addresses.find(addr => addr.isDefault);
    return defaultAddress?.id || '';
  });
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newAddress: Address = {
      id: editingAddress?.id || Date.now().toString(),
      ...formData,
      addressLine2: formData.addressLine2 || undefined
    };

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [...addresses, newAddress];
      // Auto-select the newly added address
      setSelectedAddressId(newAddress.id);
      onAddressSelect?.(newAddress);
    }

    // If this is set as default, remove default from others
    if (formData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));

    toast({
      title: editingAddress ? "Address updated" : "Address added",
      description: "Your address has been saved successfully.",
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false
    });
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address: Address) => {
    setFormData({
      ...address,
      addressLine2: address.addressLine2 || ''
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleDelete = (addressId: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
    setAddresses(updatedAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));

    toast({
      title: "Address deleted",
      description: "Address has been removed successfully.",
    });
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = addresses.find(addr => addr.id === addressId);
    if (address) {
      onAddressSelect?.(address);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#20283a]">
          {showSelection ? 'Select Delivery Address' : 'Manage Addresses'}
        </h3>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-[#f15a59] hover:bg-[#d63031] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Address
        </Button>
      </div>

      {/* Address List */}
      <div className="space-y-3">
        {showSelection && addresses.length > 1 ? (
          <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect}>
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${selectedAddressId === address.id
                    ? 'border-[#f15a59] bg-[#f15a59]/5'
                    : 'border-gray-200'
                  }`}
                onClick={() => handleAddressSelect(address.id)}  // <-- Select on card click
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value={address.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-[#f15a59]" />
                      <span className="font-semibold">{address.name}</span>
                      {address.isDefault && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">
                      <b>Address:</b> {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <br />
                    <p className="text-gray-600 text-sm"><b>Phone:</b> {address.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${showSelection && selectedAddressId === address.id
                  ? 'border-[#f15a59] bg-[#f15a59]/5'
                  : 'border-gray-200 hover:border-gray-300'
                }`}
              onClick={() => showSelection && handleAddressSelect(address.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#f15a59]" />
                    <span className="font-semibold">{address.name}</span>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
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
                  <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                </div>

                {!showSelection && (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2 (Optional)
              </label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 text-[#f15a59] focus:ring-[#f15a59] border-gray-300 rounded"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <div className="flex space-x-3">
              <Button type="submit" className="bg-[#f15a59] hover:bg-[#d63031] text-white">
                {editingAddress ? 'Update Address' : 'Save Address'}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddressForm;