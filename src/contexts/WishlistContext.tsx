import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { getToken } from './AuthContext'; // Adjust the import path accordingly
import { useToast } from '@/hooks/use-toast';

interface WishlistItem {
  _id: string;
  name: string;
  image?: string;
  price: number;
  category?: string;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  // ✅ Fetch user's wishlist from backend on load
  useEffect(() => {
    const fetchWishlist = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5000/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistItems(res.data.wishlist || []);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      }
    };

    fetchWishlist();
  }, []);

  const addToWishlist = async (item: WishlistItem) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/wishlist',
        { productId: item._id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlistItems(res.data.wishlist || []);
      toast({ title: 'Added to wishlist' });
    } catch (err) {
      console.error('Add to wishlist failed:', err);
      toast({ title: 'Failed to add', variant: 'destructive' });
    }
  };

  const removeFromWishlist = async (id: string) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await axios.post(
        'http://localhost:5000/api/users/wishlist',
        { productId: id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setWishlistItems(res.data.wishlist || []);
      toast({ title: 'Removed from wishlist' });
    } catch (err) {
      console.error('Remove from wishlist failed:', err);
      toast({ title: 'Failed to remove', variant: 'destructive' });
    }
  };

  const isInWishlist = (id: string) =>
    wishlistItems.some((item) => item._id === id);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};