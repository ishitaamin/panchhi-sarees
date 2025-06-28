import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';

interface Product {
  _id: string;
  name: string;
  image?: string;
  price: number;
  category?: string;
  fabric?: string;
  rating?: number;
  createdAt?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const rating = product.rating || 0;
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category
      });
    }
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#f15a59]/20">
      <Link to={`/product/${product._id}`}>
        <div className="relative overflow-hidden group">
          <img
            src={product.image || 'https://via.placeholder.com/300'}
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-all duration-300
      ${isInWishlist(product._id)
                ? 'bg-[#f15a59] text-white'
                : 'bg-white text-[#20283a] hover:bg-[#f15a59] hover:text-white opacity-0 group-hover:opacity-100'}
    `}
          >
            <Heart
              className={`h-5 w-5 transition-colors duration-300 ${isInWishlist(product._id) ? 'fill-current' : ''
                }`}
            />
          </button>
        </div>


        <div className="p-4">
          <h3 className="font-medium text-[#20283a] mb-2 line-clamp-2 group-hover:text-[#f15a59] transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">{rating.toFixed(1)}</span>
          </div>

          <div className="text-lg font-bold text-[#20283a]">₹{product.price.toLocaleString()}</div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;