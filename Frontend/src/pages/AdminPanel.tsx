import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, LogOut, ExternalLink, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import AdminLogin from '@/components/AdminLogin';
import ImageUpload from '@/components/ImageUpload';
import Pagination from '@/components/Pagination';
import ProductSearchFilter from '@/components/ProductSearchFilter';
import OrderSearchFilter from '@/components/OrderSearchFilter';
import OrderDetailsModal from '@/components/OrderDetailsModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import axios from 'axios';
import { API_URL } from '../config/env';

const AdminPanel = () => {
  const { admin, isAdminAuthenticated, logoutAdmin } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSize, setSelectedSize] = useState('All Sizes');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Orders state
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const [ordersItemsPerPage, setOrdersItemsPerPage] = useState(5);
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [selectedOrderStatus, setSelectedOrderStatus] = useState('All Statuses');

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{orderId: string, newStatus: string} | null>(null);

  // Fetch products
  useEffect(() => {
    axios.get(`${API_URL}/api/products`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err));
  }, []);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    fabric: '',
    images: [] as File[],
    size: [] as string[],
  });

  // Filter and search logic
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter((product: any) => product.category === selectedCategory);
    }

    // Apply size filter
    if (selectedSize !== 'All Sizes') {
      filtered = filtered.filter((product: any) =>
        product.size && product.size.includes(selectedSize)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, searchTerm, selectedCategory, selectedSize]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Orders pagination
  const ordersTotalPages = Math.ceil(filteredOrders.length / ordersItemsPerPage);
  const ordersStartIndex = (ordersCurrentPage - 1) * ordersItemsPerPage;
  const paginatedOrders = filteredOrders.slice(ordersStartIndex, ordersStartIndex + ordersItemsPerPage);

  // Form validation
  const validateProductForm = () => {
    const errors: Record<string, string> = {};

    if (!newProduct.name.trim()) errors.name = 'Product name is required';
    if (!newProduct.category) errors.category = 'Category is required';
    if (!newProduct.price || Number(newProduct.price) <= 0) errors.price = 'Valid price is required';
    if (!newProduct.stock || Number(newProduct.stock) < 0) errors.stock = 'Valid stock quantity is required';
    if (!newProduct.description.trim()) errors.description = 'Description is required';
    if (newProduct.size.length === 0) errors.size = 'At least one size must be selected';
    if (!newProduct.fabric.trim()) errors.fabric = 'Fabric name is required';
    if (!editingProduct && newProduct.images.length === 0) errors.images = 'Product image is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validateProductForm()) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price);
      formData.append("description", newProduct.description);
      formData.append("quantity", newProduct.stock);
      formData.append("category", newProduct.category);
      formData.append("fabric", newProduct.fabric);

      newProduct.size.forEach((s) => {
        formData.append("size", s);
      });

      if (newProduct.images[0]) {
        formData.append("image", newProduct.images[0]);
      }

      for (let pair of formData.entries()) {
        console.log(`📤 ${pair[0]}: ${pair[1]}`);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        toast({ title: "No token", description: "Please login again" });
        return;
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      if (editingProduct) {
        await axios.put(`${API_URL}/api/products/${editingProduct._id}`, formData, config);
        toast({ title: "Product Updated" });
      } else {
        await axios.post(`${API_URL}/api/products`, formData, config);
        toast({ title: "Product Added" });
      }

      setShowAddProduct(false);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        fabric: '',
        images: [],
        size: [],
      });

      const updated = await axios.get(`${API_URL}/api/products`);
      setProducts(updated.data);
    } catch (error: any) {
      console.error("❌ Product Add/Edit Error:", error?.response || error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name || '',
      category: product.category || '',
      price: product.price?.toString() || '',
      stock: (product.stock || product.quantity)?.toString() || '',
      description: product.description || '',
      fabric: product.fabric || '',
      size: product.size || [],
      images: [], // images will be handled by ImageUpload component
    });
    setShowAddProduct(true);
  };

  const handleDeleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`${API_URL}/api/products/${id}`, config);
      toast({ title: "Product Deleted" });

      const updated = await axios.get(`${API_URL}/api/products`);
      setProducts(updated.data);
    } catch (err: any) {
      console.error("❌ Product Deletion Error:", err?.response || err);
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete product" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (images: File[]) => {
    setNewProduct({ ...newProduct, images });
  };

  const handleViewProduct = (productId: string) => {
    window.open(`/product/${productId}`, '_blank');
  };

  const handleViewProductOnSite = (category: string) => {
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    window.open(`/category/${categorySlug}`, '_blank');
  };

  // Fetch orders
  useEffect(() => {
    if (activeTab === 'orders') {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get(`${API_URL}/api/orders/all`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setOrders(res.data))
        .catch((err) => console.error(err));
      }
    }
  }, [activeTab]);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    if (orderSearchTerm) {
      filtered = filtered.filter((order: any) =>
        order._id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(orderSearchTerm.toLowerCase())
      );
    }

    if (selectedOrderStatus !== 'All Statuses') {
      filtered = filtered.filter((order: any) => order.orderStatus === selectedOrderStatus);
    }

    setFilteredOrders(filtered);
    setOrdersCurrentPage(1);
  }, [orders, orderSearchTerm, selectedOrderStatus]);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (newStatus === 'shipped') {
      setPendingStatusChange({ orderId, newStatus });
      setShowStatusConfirm(true);
    } else {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const confirmStatusChange = () => {
    if (pendingStatusChange) {
      updateOrderStatus(pendingStatusChange.orderId, pendingStatusChange.newStatus);
    }
    setShowStatusConfirm(false);
    setPendingStatusChange(null);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/api/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refresh orders
      const updated = await axios.get(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(updated.data);
      
      if (newStatus === 'shipped') {
        toast({ title: "Order marked as shipped and confirmation email sent to customer" });
      } else {
        toast({ title: "Order status updated successfully" });
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: "Failed to update order status",
        variant: "destructive" 
      });
    }
  };

  const handleViewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#20283a]">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Welcome, {admin?.username}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.open('/', '_blank')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>View Website</span>
            </Button>
            <Button
              onClick={logoutAdmin}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['products', 'orders'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                    ? 'border-[#f15a59] text-[#f15a59]'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#20283a]">Product Management</h2>
              <div className="flex space-x-3">
                <Button
                  onClick={() => window.open('/category/all', '_blank')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View All Products</span>
                </Button>
                <Button
                  onClick={() => setShowAddProduct(true)}
                  className="bg-[#f15a59] hover:bg-[#d63031] text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Add/Edit Product Form */}
            {showAddProduct && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-[#20283a] mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter product name"
                      />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] ${formErrors.category ? 'border-red-500' : 'border-gray-300'
                          }`}
                      >
                        <option value="">Select Category</option>
                        <option value="Sarees">Sarees</option>
                        <option value="Kurtis">Kurtis</option>
                        <option value="Lehengas">Lehengas</option>
                        <option value="Bridal">Bridal Wear</option>
                      </select>
                      {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] ${formErrors.price ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter price"
                      />
                      {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] ${formErrors.stock ? 'border-red-500' : 'border-gray-300'
                          }`}
                        placeholder="Enter stock quantity"
                      />
                      {formErrors.stock && <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Available Sizes <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Free Size', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => {
                        const selected = newProduct.size.includes(size);
                        return (
                          <div
                            key={size}
                            onClick={() => {
                              const updatedSizes = selected
                                ? newProduct.size.filter(s => s !== size)
                                : [...newProduct.size, size];
                              setNewProduct({ ...newProduct, size: updatedSizes });
                            }}
                            className={`cursor-pointer select-none rounded-md border px-3 py-1 text-sm font-medium
            ${selected ? 'bg-[#f15a59] text-white border-[#f15a59]' : 'bg-white text-gray-700 border-gray-300'}
            hover:bg-[#f15a59] hover:text-white hover:border-[#f15a59] transition-colors duration-200`}
                          >
                            {size}
                          </div>
                        );
                      })}
                    </div>
                    {formErrors.size && <p className="text-red-500 text-xs mt-1">{formErrors.size}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] ${formErrors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter product description"
                    />
                    {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fabric <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={newProduct.fabric}
                      onChange={(e) => setNewProduct({ ...newProduct, fabric: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                      placeholder="Enter fabric type"
                    />
                    {formErrors.fabric && <p className="text-red-500 text-xs mt-1">{formErrors.fabric}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images {!editingProduct && <span className="text-red-500">*</span>}
                    </label>
                    <ImageUpload
                      onImageSelect={handleImageSelect}
                      existingImages={editingProduct ? [] : undefined}
                    />
                    {formErrors.images && <p className="text-red-500 text-xs mt-1">{formErrors.images}</p>}
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <Button onClick={handleAddProduct} className="bg-[#f15a59] hover:bg-[#d63031] text-white">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Update Product' : 'Save Product'}
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddProduct(false);
                      setEditingProduct(null);
                      setFormErrors({});
                      setNewProduct({ name: '', category: '', price: '', stock: '', description: '', fabric: '', images: [], size: [] });
                    }}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Recently Added Products Quick Links */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-[#20283a] mb-3">Quick Links - View Products by Category</h3>
              <div className="flex flex-wrap gap-2">
                {['Sarees', 'Kurtis', 'Lehengas', 'Bridal'].map((category) => (
                  <Button
                    key={category}
                    onClick={() => handleViewProductOnSite(category)}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>{category}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Search and Filter */}
            <ProductSearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#20283a]">Products ({filteredProducts.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{product.price.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.size ? product.size.join(', ') : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleViewProduct(product._id)}
                              variant="outline"
                              size="sm"
                              title="View product page"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product._id)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  onItemsPerPageChange={setItemsPerPage}
                  totalItems={filteredProducts.length}
                />
              )}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-[#20283a]">Order Management</h2>
            </div>

            {/* Order Search and Filter */}
            <OrderSearchFilter
              searchTerm={orderSearchTerm}
              onSearchChange={setOrderSearchTerm}
              selectedStatus={selectedOrderStatus}
              onStatusChange={setSelectedOrderStatus}
            />

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-[#20283a]">Orders ({filteredOrders.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedOrders.map((order: any) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order._id.toString().slice(-8)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.user?.name}</div>
                          <div className="text-sm text-gray-500">{order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.orderItems.length} item(s)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewOrderDetails(order)}
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Orders Pagination */}
              {filteredOrders.length > 0 && (
                <Pagination
                  currentPage={ordersCurrentPage}
                  totalPages={ordersTotalPages}
                  onPageChange={setOrdersCurrentPage}
                  itemsPerPage={ordersItemsPerPage}
                  onItemsPerPageChange={setOrdersItemsPerPage}
                  totalItems={filteredOrders.length}
                />
              )}
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          order={selectedOrder}
        />

        {/* Status Change Confirmation Dialog */}
        <AlertDialog open={showStatusConfirm} onOpenChange={setShowStatusConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this order as "Shipped"? A confirmation email will be sent to the customer with order details.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowStatusConfirm(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmStatusChange}>Confirm & Send Email</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Loading overlay */}
        {isLoading && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="w-12 h-12 border-4 border-t-transparent border-[#f15a59] rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
