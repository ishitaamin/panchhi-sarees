
import React from 'react';
import { Search } from 'lucide-react';

interface ProductSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedSize: string;
  onSizeChange: (size: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProductSearchFilter: React.FC<ProductSearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  selectedSize,
  onSizeChange,
  selectedCategory,
  onCategoryChange,
}) => {
  const sizes = ['All Sizes', 'Free Size', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const categories = ['All Categories', 'Sarees', 'Kurtis', 'Lehengas', 'Bridal'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
          />
        </div>
        
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <select
            value={selectedSize}
            onChange={(e) => onSizeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59]"
          >
            {sizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductSearchFilter;
