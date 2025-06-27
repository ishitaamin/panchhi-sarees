import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { getToken } from "../contexts/AuthContext"; // Adjust the path accordingly
import { API_URL } from "../config/env";

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
}

interface AddressFormProps {
  onAddressSelect?: (address: Address | null) => void;
  showSelection?: boolean;
  allowEditing?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  onAddressSelect,
  showSelection = false,
  allowEditing = false,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: false,
  });

  // Fetch addresses from backend on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = getToken();
        if (!token) {
          setAddresses([]);
          return;
        }
        const res = await axios.get(`${API_URL}/api/users/address`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAddresses(res.data.addresses || []);
      } catch (error) {
        console.error("Failed to load addresses", error);
        toast({ title: "Failed to load addresses", variant: "destructive" });
      }
    };
    fetchAddresses();
  }, [toast]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      isDefault: false,
    });
    setShowForm(false);
    setEditingAddress(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newAddress: Address = {
      fullName: formData.fullName,
      phone: formData.phone,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2 || "",
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      country: formData.country || "India",
      isDefault: formData.isDefault || false,
    };

    try {
      const token = getToken();
      if (!token) {
        toast({ title: "Please log in to manage addresses", variant: "destructive" });
        return;
      }

      let res;

      if (editingAddress) {
        // Use id instead of index
        res = await axios.put(
          `${API_URL}/api/users/address`,
          { id: editingAddress.id, updatedAddress: newAddress },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAddresses(res.data.addresses);
        toast({ title: "Address updated", description: "Your address has been updated." });
      } else {
        // Add new address
        res = await axios.post(
          `${API_URL}/api/users/address`,
          newAddress,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAddresses(res.data.addresses);
        toast({ title: "Address added", description: "Your address has been saved." });
      }

      if (showSelection) {
        // For new addresses, backend assigns id, get last address from backend response
        const savedAddress = editingAddress
          ? newAddress
          : res.data.addresses[res.data.addresses.length - 1];

        setSelectedAddressId(savedAddress.id || "");
        onAddressSelect?.(savedAddress);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save address", error);
      toast({ title: "Failed to save address", variant: "destructive" });
    }
  };

  const handleDelete = async (addressId: string) => {
    try {
      const token = getToken();
      if (!token) {
        toast({ title: "Please log in to manage addresses", variant: "destructive" });
        return;
      }

      const res = await axios.delete(`${API_URL}/api/users/address`, {
        data: { id: addressId },
        headers: { Authorization: `Bearer ${token}` },
      });

      setAddresses(res.data.addresses);

      if (selectedAddressId === addressId) {
        setSelectedAddressId("");
        onAddressSelect?.(null);
      }

      toast({ title: "Address deleted", description: "Address removed successfully." });
    } catch (error) {
      console.error("Failed to delete address", error);
      toast({ title: "Failed to delete address", variant: "destructive" });
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      isDefault: address.isDefault || false,
    });
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = addresses.find((addr) => addr.id === addressId) || null;
    onAddressSelect?.(address);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#20283a]">
          {showSelection ? "Select Delivery Address" : "Manage Addresses"}
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
        {showSelection && addresses.length > 0 ? (
          <RadioGroup value={selectedAddressId} onValueChange={handleAddressSelect}>
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${selectedAddressId === address.id
                    ? "border-[#f15a59] bg-[#f15a59]/5"
                    : "border-gray-200"
                  }`}
                onClick={() => handleAddressSelect(address.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <RadioGroupItem value={address.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <MapPin className="h-4 w-4 text-[#f15a59]" />
                        <span className="font-semibold break-words">{address.fullName}</span>
                        {address.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>

                      {allowEditing && (
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(address);
                            }}
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(address.id);
                            }}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm break-words">
                      <b>Address:</b> {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`}
                    </p>
                    <p className="text-gray-600 text-sm break-words">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <br />
                    <p className="text-gray-600 text-sm">
                      <b>Phone:</b> {address.phone}
                    </p>
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
                  ? "border-[#f15a59] bg-[#f15a59]/5"
                  : "border-gray-200 hover:border-gray-300"
                }`}
              onClick={() => showSelection && handleAddressSelect(address.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-[#f15a59]" />
                    <span className="font-semibold break-words">{address.fullName}</span>
                    {address.isDefault && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm break-words">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-start">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(address)}>
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
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4">
            {editingAddress ? "Edit Address" : "Add New Address"}
          </h4>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Form fields unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
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
                {editingAddress ? "Update Address" : "Save Address"}
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