import { useEffect, useRef, useState } from "react";
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
import { Typewriter } from 'react-simple-typewriter';
import axios from "axios";

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const nextRef = useRef<HTMLButtonElement>(null);
  const offers = [
    {
      id: 1,
      title: "Jazz up for the season - Up to 50% Off",
      subtitle: "With our Spring Summer'25 Collection",
      image: "../assets/images/cover1.jpg",
      cta: "Shop Now"
    },
    {
      id: 2,
      title: "Find your Sparkle, Find your Style",
      subtitle: "Starting from ₹999",
      image: "../assets/images/cover2.jpg",
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
      image: "../assets/images/client1.png",
    },
    {
      id: 2,
      image: "../assets/images/client2.png",
    },
    {
      id: 3,
      image: "../assets/images/client3.png",
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextRef.current?.click();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products") // Replace with your live URL if needed
      .then(res => {
        const latest = res.data.slice(0, 8); // latest 8
        setTrendingProducts(latest);
      })
      .catch(err => console.error("Failed to fetch trending products:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-r from-[#f15a59]/10 to-[#20283a]/10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="../assets/images/bg1.jpg"
            alt="Traditional Indian Fashion"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
          <div className="text-white max-w-2xl text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              Celebrate Your<br />
              <span className="text-[#f15a59] font-normal italic sans">
                <Typewriter
                  words={['Elegance', 'Style', 'Ethnicity', 'Tradition', 'Grace']}
                  loop={0} // 0 means infinite loop
                  cursor
                  cursorStyle="|"
                  typeSpeed={80}
                  deleteSpeed={50}
                  delaySpeed={1500}
                />
              </span>
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Unleash your inner Desi Diva <br /> Shop for all occasions with Panchhi
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
          <div className="py-4 flex flex-wrap justify-center items-center gap-4 sm:gap-6">

            {/* Shop by Occasion */}
            <div className="relative group">
              <div className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors cursor-pointer">
                Shop by Occasion
                <ChevronDown className="ml-1 h-3 w-3 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0">
                <div className="grid gap-1 p-4">
                  <Link to="/category/wedding" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Wedding</Link>
                  <Link to="/category/anniversary" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Anniversary</Link>
                  <Link to="/category/birthday" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Birthday</Link>
                  <Link to="/category/kitty-party" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Kitty-Party</Link>
                  <Link to="/category/get-together" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Get Together</Link>
                  <Link to="/category/cocktail" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Cocktail</Link>
                  <Link to="/category/festive" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Festive</Link>
                  <Link to="/category/evening" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Evening</Link>
                  <Link to="/category/casual" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Casual</Link>
                  <Link to="/category/business" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Business</Link>
                </div>
              </div>
            </div>

            {/* Shop by Age */}
            <div className="relative group">
              <div className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors cursor-pointer">
                Shop by Age
                <ChevronDown className="ml-1 h-3 w-3 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0">
                <div className="grid gap-1 p-4">
                  <Link to="/category/teen" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Teens (12–18)</Link>
                  <Link to="/category/adult" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Adults (18–40)</Link>
                  <Link to="/category/senior" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Seniors (40+)</Link>
                </div>
              </div>
            </div>

            {/* Shop by Fabric */}
            <div className="relative group">
              <div className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors cursor-pointer">
                Shop by Fabric
                <ChevronDown className="ml-1 h-3 w-3 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0">
                <div className="grid gap-1 p-4">
                  <Link to="/category/silk" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Silk</Link>
                  <Link to="/category/cotton" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Cotton</Link>
                  <Link to="/category/chiffon" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Chiffon</Link>
                  <Link to="/category/georgette" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Georgette</Link>
                  <Link to="/category/net" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Net</Link>
                  <Link to="/category/velvet" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Velvet</Link>
                  <Link to="/category/muslin" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Muslin</Link>
                  <Link to="/category/linen" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Linen</Link>
                  <Link to="/category/rayon" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Rayon</Link>
                </div>
              </div>
            </div>

            {/* Shop by Category */}
            <div className="relative group">
              <div className="flex items-center text-[#20283a] hover:text-[#f15a59] text-sm font-medium transition-colors cursor-pointer">
                Shop by Category
                <ChevronDown className="ml-1 h-3 w-3 transition-transform group-hover:rotate-180" />
              </div>
              <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 right-0 sm:left-0">
                <div className="grid gap-1 p-4">
                  <Link to="/category/sarees" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Sarees</Link>
                  <Link to="/category/kurtis" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Kurtis</Link>
                  <Link to="/category/lehengas" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Chaniya Choli</Link>
                  <Link to="/category/bridal" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Gown</Link>
                  <Link to="/category/bridal" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Indo-Western</Link>
                  <Link to="/category/lehengas" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Lehengas</Link>
                  <Link to="/category/bridal" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Bridal Wear</Link>
                  <Link to="/category/blouse" className="block px-4 py-2 hover:bg-gray-100 rounded text-sm hover:text-[#f15a59]">Readymade Stitched Blouse</Link>
                </div>
              </div>
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
                  className="w-full h-50 object-cover group-hover:scale-105 transition-transform duration-300"
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
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop Gallery */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#20283a] mb-8">Sneak Peek in the Shop</h2>
          <div className="relative max-w-5xl mx-auto rounded-lg overflow-hidden shadow-xl group">
            <img
              src="../assets/images/sneakpeek.png"
              alt="Panchhi Sarees Store Interior"
              className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
            />
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
            className="w-full max-w-5xl mx-auto relative"
          >
            <CarouselContent>
              {clientDiaries.map((diary) => (
                <CarouselItem key={diary.id}>
                  <div className="p-2">
                    <div className="relative rounded-lg overflow-hidden group">
                      <img
                        src={diary.image}
                        alt={`Client Story ${diary.id}`}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4" />
            <CarouselNext ref={nextRef} className="absolute right-4 top-1/2 -translate-y-1/2 z-10" />
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