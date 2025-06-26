
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

type Product = {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  price: number;
  category?: string;
  quantity: number;
  fabric?: string;
  rating?: number;
  size?: string[];
  createdAt?: string;
};

const CategoryPage = () => {
  const { category } = useParams();
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 60000],
    fabric: '',
    size: '',
    rating: 0,
    sortBy: 'featured'
  });

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data))
      .catch(err => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

  const categoryProducts = useMemo(() => {
    let filtered = products.filter(product =>
      category === 'all' || product.category?.toLowerCase() === category?.toLowerCase()
    );

    if (filters.fabric) {
      filtered = filtered.filter(p => p.fabric === filters.fabric);
    }

    if (filters.size) {
      filtered = filtered.filter(p => p.size && p.size.includes(filters.size));
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(p => (p.rating || 0) >= filters.rating);
    }

    filtered = filtered.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    switch (filters.sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return filtered.sort(
          (a, b) =>
            new Date(b.createdAt || '2000-01-01').getTime() -
            new Date(a.createdAt || '2000-01-01').getTime()
        );
      default:
        return filtered;
    }
  }, [products, category, filters]);

  const categoryTitle = {
    sarees: 'Sarees',
    kurtis: 'Kurtis',
    lehengas: 'Lehengas',
    bridal: 'Bridal Wear',
    all: 'All Products'
  }[category?.toLowerCase() || 'all'] || 'Products';

  const fabrics = [...new Set(products.map(p => p.fabric).filter(Boolean))];
  const sizes = [...new Set(products.flatMap(p => p.size || []).filter(Boolean))];

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceRange: [0, 60000],
      fabric: '',
      size: '',
      rating: 0,
      sortBy: 'featured'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Banner */}
      <div className="bg-gradient-to-r from-[#f15a59] to-[#20283a] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{categoryTitle}</h1>
          <p className="mt-2 text-lg opacity-90">
            Discover our exquisite collection of {categoryTitle.toLowerCase()}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border border-gray-300"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showFilters ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#20283a]">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#f15a59] hover:text-[#d63031] transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={e => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="60000"
                      step="1000"
                      value={filters.priceRange[1]}
                      onChange={e =>
                        handleFilterChange('priceRange', [
                          0,
                          parseInt(e.target.value)
                        ])
                      }
                      className="w-full accent-[#f15a59]"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Fabric */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fabric
                  </label>
                  <select
                    value={filters.fabric}
                    onChange={e => handleFilterChange('fabric', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
                  >
                    <option value="">All Fabrics</option>
                    {fabrics.map(fabric => (
                      <option key={fabric} value={fabric}>
                        {fabric.charAt(0).toUpperCase() + fabric.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <select
                    value={filters.size}
                    onChange={e => handleFilterChange('size', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
                  >
                    <option value="">All Sizes</option>
                    {sizes.map(size => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() =>
                          handleFilterChange(
                            'rating',
                            filters.rating === rating ? 0 : rating
                          )
                        }
                        className={`flex items-center space-x-2 w-full p-2 text-left rounded-lg transition-colors ${
                          filters.rating === rating
                            ? 'bg-[#f15a59]/10 text-[#f15a59]'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span>{rating}+ Stars</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {categoryProducts.length} products
              </p>
            </div>

            {categoryProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found matching your filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-[#f15a59] hover:text-[#d63031] font-medium"
                >
                  Clear filters to see all products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
