
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AddressForm from './AddressForm';

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface AddressManagerProps {
  onAddressSelect?: (address: Address) => void;
  showSelection?: boolean;
  allowEditing?: boolean;
}

const AddressManager: React.FC<AddressManagerProps> = ({
  onAddressSelect,
  showSelection = false,
  allowEditing = true
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSaveAddress = (addressData: any) => {
    const newAddress: Address = {
      ...addressData,
      id: editingAddress ? editingAddress.id : Date.now().toString(),
    };

    if (editingAddress) {
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      ));
    } else {
      setAddresses([...addresses, newAddress]);
    }

    setIsAddingNew(false);
    setEditingAddress(null);

    if (onAddressSelect) {
      onAddressSelect(newAddress);
    }
  };

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id || null);
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddingNew(true);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddresses(addresses.filter(addr => addr.id !== addressId));
    if (selectedAddressId === addressId) {
      setSelectedAddressId(null);
    }
  };

  if (isAddingNew || editingAddress) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-[#20283a] mb-6">
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </h2>
        <AddressForm
          address={editingAddress}
          onSave={handleSaveAddress}
          onCancel={() => {
            setIsAddingNew(false);
            setEditingAddress(null);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#20283a]">
          {showSelection ? 'Select Delivery Address' : 'Manage Addresses'}
        </h2>
        {allowEditing && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="bg-[#f15a59] hover:bg-[#d63031] text-white"
          >
            Add New Address
          </Button>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No addresses saved yet.</p>
          {allowEditing && (
            <Button
              onClick={() => setIsAddingNew(true)}
              className="mt-4 bg-[#f15a59] hover:bg-[#d63031] text-white"
            >
              Add Your First Address
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border rounded-lg p-4 ${
                showSelection && selectedAddressId === address.id
                  ? 'border-[#f15a59] bg-red-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {showSelection && (
                    <div className="mb-2">
                      <input
                        type="radio"
                        id={`address-${address.id}`}
                        name="selectedAddress"
                        checked={selectedAddressId === address.id}
                        onChange={() => handleSelectAddress(address)}
                        className="mr-2"
                      />
                      <label htmlFor={`address-${address.id}`} className="font-medium">
                        {address.isDefault && <span className="text-green-600">(Default) </span>}
                        Select this address
                      </label>
                    </div>
                  )}
                  <div className="text-sm space-y-1">
                    <p className="font-semibold">{address.fullName}</p>
                    <p>{address.addressLine1}</p>
                    {address.addressLine2 && <p>{address.addressLine2}</p>}
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                    <p>{address.country}</p>
                    <p className="text-gray-600">Phone: {address.phone}</p>
                  </div>
                </div>
                {allowEditing && (
                  <div className="flex space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditAddress(address)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAddress(address.id!)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManager;
