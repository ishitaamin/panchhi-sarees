
import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);

  const searchResults = useMemo(() => {
    if (!searchTerm) return [];
    
    const lowercaseQuery = searchTerm.toLowerCase();
    return productsData.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.fabric.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery)
    );
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for sarees, kurtis, lehengas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
            />
          </div>
        </div>

        {/* Search Results */}
        <div>
          {searchTerm ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#20283a]">
                  Search Results for "{searchTerm}"
                </h1>
                <p className="text-gray-600 mt-1">
                  {searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {searchResults.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-600">
                    Try searching with different keywords or browse our categories
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Search Products</h2>
              <p className="text-gray-600">
                Enter a search term to find your favorite products
              </p>
            </div>
          )}
        </div>

        {/* Popular Searches */}
        {!searchTerm && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-[#20283a] mb-4">Popular Searches</h3>
            <div className="flex flex-wrap gap-2">
              {['Silk Sarees', 'Cotton Kurtis', 'Bridal Lehengas', 'Party Wear', 'Traditional'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchTerm(term)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:border-[#f15a59] hover:text-[#f15a59] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
