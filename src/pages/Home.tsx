import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Star, Gift, Truck, Shield, HeadphonesIcon, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

  const clientDiaries = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=400&fit=crop",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1595777216528-85527e5f2d4c?w=800&h=400&fit=crop",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=400&fit=crop",
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=400&fit=crop",
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="py-4 flex items-center justify-center space-x-8">
            {/* Shop by Occasion */}
            <Popover>
              <PopoverTrigger className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors">
                Shop by Occasion
                <ChevronDown className="ml-1 h-3 w-3" />
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="center">
                <div className="grid gap-1 p-4">
                  <Link to="/category/wedding" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Wedding</Link>
                  <Link to="/category/party" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Party</Link>
                  <Link to="/category/festival" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Festival</Link>
                  <Link to="/category/casual" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Casual</Link>
                  <Link to="/category/office" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Office</Link>
                </div>
              </PopoverContent>
            </Popover>

            {/* Shop by Age */}
            <Popover>
              <PopoverTrigger className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors">
                Shop by Age
                <ChevronDown className="ml-1 h-3 w-3" />
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="center">
                <div className="grid gap-1 p-4">
                  <Link to="/category/kids" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Kids (2-12 years)</Link>
                  <Link to="/category/teen" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Teen (13-19 years)</Link>
                  <Link to="/category/young-adult" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Young Adult (20-35 years)</Link>
                  <Link to="/category/adult" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Adult (36-50 years)</Link>
                  <Link to="/category/senior" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Senior (50+ years)</Link>
                </div>
              </PopoverContent>
            </Popover>

            {/* Shop by Fabric */}
            <Popover>
              <PopoverTrigger className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors">
                Shop by Fabric
                <ChevronDown className="ml-1 h-3 w-3" />
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="center">
                <div className="grid gap-1 p-4">
                  <Link to="/category/silk" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Silk</Link>
                  <Link to="/category/cotton" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Cotton</Link>
                  <Link to="/category/chiffon" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Chiffon</Link>
                  <Link to="/category/georgette" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Georgette</Link>
                  <Link to="/category/net" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Net</Link>
                  <Link to="/category/velvet" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Velvet</Link>
                </div>
              </PopoverContent>
            </Popover>

            {/* Shop by Category */}
            <Popover>
              <PopoverTrigger className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors">
                Shop by Category
                <ChevronDown className="ml-1 h-3 w-3" />
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="center">
                <div className="grid gap-1 p-4">
                  <Link to="/category/sarees" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Sarees</Link>
                  <Link to="/category/lehengas" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Lehengas</Link>
                  <Link to="/category/kurtis" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Kurtis</Link>
                  <Link to="/category/bridal" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Bridal Wear</Link>
                  <Link to="/category/accessories" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm">Accessories</Link>
                </div>
              </PopoverContent>
            </Popover>
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

      {/* Shop Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#20283a] mb-8">Visit Our Store</h2>
          <div className="relative rounded-lg overflow-hidden shadow-xl group">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
              alt="Panchhi Sarees Store Interior"
              className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Experience Traditional Elegance</h3>
                <p className="text-lg opacity-90">Visit our beautiful store in Vadodara for personalized styling and expert guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Diaries Carousel */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#20283a] mb-8">Client Diaries</h2>
          <p className="text-center text-gray-600 mb-8">Discover the stories behind our beautiful collections</p>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto relative"
          >
            <CarouselContent>
              {clientDiaries.map((diary) => (
                <CarouselItem key={diary.id}>
                  <div className="p-2">
                    <div className="relative rounded-lg overflow-hidden group">
                      <img
                        src={diary.image}
                        alt={`Client Story ${diary.id}`}
                        className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
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
