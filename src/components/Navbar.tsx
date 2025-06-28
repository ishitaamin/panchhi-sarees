import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import WishlistButton from './WishlistButton';
import PanchhiLogo from '../assets/images/PanchhiLogo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={PanchhiLogo} alt="Panchhi" className="h-14 w-auto max-w-full object-contain" loading='lazy'/>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sarees, kurtis, lehengas..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <WishlistButton />

            <Link to="/cart" className="relative p-2 text-[#20283a] hover:text-[#f15a59] transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f15a59] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/account" className="flex items-center space-x-2 p-2 text-[#20283a] hover:text-[#f15a59] transition-colors">
                  <User className="h-6 w-6" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-[#f15a59] hover:text-[#d63031] transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 p-2 text-[#20283a] hover:text-[#f15a59] transition-colors">
                <User className="h-6 w-6" />
                <span className="text-sm font-medium">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#20283a] hover:text-[#f15a59] transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#f15a59] focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <div className="flex items-center justify-between px-3 py-2 border-t mt-3 pt-3">
              <div className="flex items-center space-x-4">
                <WishlistButton />

                <Link to="/cart" className="relative" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" size="icon" className='p-0'>
                    <ShoppingCart className="h-6 w-6 transform scale-150" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 h-5 w-5 bg-[#f15a59] text-white text-xs rounded-full flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="flex items-center space-x-3 p-3 text-[#20283a] hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 p-3 text-[#f15a59] hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button className="bg-[#f15a59] hover:bg-[#d63031] text-white">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Navigation */}
      <div className="bg-[#20283a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 py-3 text-sm font-medium overflow-x-auto">
            <Link to="/category/sarees" className="hover:text-[#f15a59] transition-colors whitespace-nowrap">
              Sarees
            </Link>
            <Link to="/category/kurtis" className="hover:text-[#f15a59] transition-colors whitespace-nowrap">
              Kurtis
            </Link>
            <Link to="/category/lehengas" className="hover:text-[#f15a59] transition-colors whitespace-nowrap">
              Lehengas
            </Link>
            <Link to="/category/bridal" className="hover:text-[#f15a59] transition-colors whitespace-nowrap">
              Bridal Wear
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;