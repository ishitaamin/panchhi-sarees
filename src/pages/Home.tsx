
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Gift, Truck, Shield, HeadphonesIcon } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products.json';

const Home = () => {
  const trendingProducts = productsData.slice(0, 4);
  const offers = [
    {
      id: 1,
      title: "Festive Sale - Up to 50% Off",
      subtitle: "On all Sarees & Lehengas",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=400&fit=crop",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Bridal Collection",
      subtitle: "Starting from ₹15,999",
      image: "https://images.unsplash.com/photo-1595777216528-85527e5f2d4c?w=800&h=400&fit=crop",
      cta: "Explore"
    }
  ];

  const categories = [
    {
      name: 'Sarees',
      image: '../assets/images/1.png',
      link: '/category/sarees',
      description: 'Traditional & Designer'
    },
    {
      name: 'Kurtis',
      image: '../assets/images/2.png',
      link: '/category/kurtis',
      description: 'Casual & Festive'
    },
    {
      name: 'Lehengas',
      image: '../assets/images/3.png',
      link: '/category/lehengas',
      description: 'Wedding & Party'
    },
    {
      name: 'Bridal Wear',
      image: '../assets/images/4.png',
      link: '/category/bridal',
      description: 'Your Special Day'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-r from-[#f15a59]/10 to-[#20283a]/10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&h=800&fit=crop"
            alt="Traditional Indian Fashion"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Celebrate Your 
              <span className="text-[#f15a59]"> Elegance</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Discover the finest collection of traditional Indian wear crafted with love and tradition
            </p>
            <Link
              to="/category/sarees"
              className="inline-flex items-center bg-[#f15a59] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d63031] transition-all duration-300 hover:scale-105"
            >
              Shop Collection
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Shop by Dropdown Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 py-4 text-sm font-medium overflow-x-auto">
            <div className="group relative">
              <button className="flex items-center space-x-1 text-[#20283a] hover:text-[#f15a59] transition-colors">
                <span>Shop by Occasion</span>
                <ChevronRight className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            <div className="group relative">
              <button className="flex items-center space-x-1 text-[#20283a] hover:text-[#f15a59] transition-colors">
                <span>Shop by Age</span>
                <ChevronRight className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            <div className="group relative">
              <button className="flex items-center space-x-1 text-[#20283a] hover:text-[#f15a59] transition-colors">
                <span>Shop by Fabric</span>
                <ChevronRight className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            <div className="group relative">
              <button className="flex items-center space-x-1 text-[#20283a] hover:text-[#f15a59] transition-colors">
                <span>Shop by Category</span>
                <ChevronRight className="h-4 w-4 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Carousel */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((offer) => (
              <div key={offer.id} className="relative rounded-lg overflow-hidden group cursor-pointer">
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-lg mb-4">{offer.subtitle}</p>
                    <button className="bg-[#f15a59] text-white px-6 py-2 rounded-full hover:bg-[#d63031] transition-colors">
                      {offer.cta}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Circles */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#20283a] mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#20283a] group-hover:text-[#f15a59] transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#20283a]">Trending Now</h2>
            <Link
              to="/category/all"
              className="text-[#f15a59] hover:text-[#d63031] font-medium flex items-center transition-colors"
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-[#20283a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Truck className="h-12 w-12 mx-auto mb-4 text-[#f15a59]" />
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-gray-300">On orders above ₹1999</p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-[#f15a59]" />
              <h3 className="font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-300">100% secure transactions</p>
            </div>
            <div className="text-center">
              <Gift className="h-12 w-12 mx-auto mb-4 text-[#f15a59]" />
              <h3 className="font-semibold mb-2">Easy Returns</h3>
              <p className="text-sm text-gray-300">7-day return policy</p>
            </div>
            <div className="text-center">
              <HeadphonesIcon className="h-12 w-12 mx-auto mb-4 text-[#f15a59]" />
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-300">Always here to help</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
