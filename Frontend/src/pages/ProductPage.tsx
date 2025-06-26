import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '@/components/ui/button';
import ProductCard from '../components/ProductCard';
import ImageViewer from '../components/ImageViewer';
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
  createdAt?: string;
  size?: string[];
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [viewerImage, setViewerImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    axios.get(`http://localhost:5000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error('Failed to fetch product:', err));
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      axios
        .get(`http://localhost:5000/api/products?category=${product.category}`)
        .then(res => {
          const sameCategoryProducts = res.data
            .filter((p: Product) => p._id !== product._id && p.category === product.category)
            .sort((a: Product, b: Product) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
            .slice(0, 4);
          setRelated(sameCategoryProducts);
        })
        .catch(err => console.error('Failed to fetch related products:', err));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading product details…</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      size: selectedSize || '',
    }, quantity);
  };

  const handleBuyNow = () => {
    const buyNowProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      size: selectedSize || '',
      quantity: quantity
    };
    
    navigate('/checkout', { 
      state: { buyNowProduct } 
    });
  };

  const handleWishlistToggle = () => {
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

  const images = [product.image || ''];

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 text-sm">
            <Link to="/" className="text-[#f15a59] hover:text-[#d63031]">Home</Link> /{' '}
            <Link to={`/category/${product.category}`} className="text-[#f15a59] hover:text-[#d63031]">
              {(product.category || '').toUpperCase()}
            </Link> /{' '}
            <span className="text-gray-700">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="mb-4">
                <img
                  src={selectedImage || product.image || ''}
                  alt={product.name}
                  className="w-full h-96 md:h-[500px] object-cover rounded-lg cursor-zoom-in"
                  onClick={() => setViewerImage(selectedImage || product.image || '')}
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`border-2 rounded-lg overflow-hidden ${(selectedImage || product.image) === img ? 'border-[#f15a59]' : 'border-gray-200'
                      }`}
                  >
                    <img src={img} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#20283a] mb-4">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="ml-2 text-gray-600">{(product.rating || 0).toFixed(1)} (89 reviews)</span>
              </div>

              <div className="text-3xl font-bold text-[#20283a] mb-6">
                ₹{product.price.toLocaleString()}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Size Selection */}
              {product.size && product.size.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[#20283a] mb-3">Size</h3>
                  <div className="flex space-x-2">
                    {product.size.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg transition-colors ${selectedSize === size
                          ? 'bg-[#f15a59] text-white border-[#f15a59]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#f15a59]'
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-semibold text-[#20283a] mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-1 border rounded-lg">-</button>
                  <span className="font-semibold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-1 border rounded-lg">+</button>
                </div>
              </div>

              <div className="flex space-x-4 mb-8">
                <Button onClick={handleAddToCart} className="flex-1 bg-[#f15a59] hover:bg-[#d63031] text-white">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="flex-1 bg-[#20283a] hover:bg-[#20283a]/90 text-white">
                  Buy Now
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleWishlistToggle}
                  className={isInWishlist(product._id) ? 'bg-[#f15a59] text-white border-[#f15a59]' : ''}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2"><Truck className="h-5 w-5 text-[#f15a59]" /><span>Free Shipping</span></div>
                <div className="flex items-center space-x-2"><Shield className="h-5 w-5 text-[#f15a59]" /><span>Secure Payment</span></div>
                <div className="flex items-center space-x-2"><RotateCcw className="h-5 w-5 text-[#f15a59]" /><span>Easy Returns</span></div>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-[#20283a] mb-8">Related Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map(prod => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <ImageViewer
        src={viewerImage || ''}
        alt={product.name}
        isOpen={!!viewerImage}
        onClose={() => setViewerImage(null)}
      />
    </>
  );
};

export default ProductPage;