
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

type WishlistItem = {
  _id: string;
  name: string;
  image?: string;
  price: number;
  category?: string;
};

type WishlistContextType = {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (itemId: string) => void;
  isInWishlist: (itemId: string) => boolean;
  clearWishlist: () => void;
};

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
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Load wishlist from server when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated, user]);

  const fetchWishlist = async () => {
    try {
      // This would typically fetch from your backend
      const savedWishlist = localStorage.getItem(`wishlist_${user?.email}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    }
  };

  const saveWishlist = (items: WishlistItem[]) => {
    if (user?.email) {
      localStorage.setItem(`wishlist_${user.email}`, JSON.stringify(items));
    }
  };

  const addToWishlist = (item: WishlistItem) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    if (!isInWishlist(item._id)) {
      const updatedItems = [...wishlistItems, item];
      setWishlistItems(updatedItems);
      saveWishlist(updatedItems);
      
      toast({
        title: "Added to Wishlist",
        description: `${item.name} has been added to your wishlist`,
      });
    }
  };

  const removeFromWishlist = (itemId: string) => {
    const updatedItems = wishlistItems.filter(item => item._id !== itemId);
    setWishlistItems(updatedItems);
    saveWishlist(updatedItems);
    
    toast({
      title: "Removed from Wishlist",
      description: "Item has been removed from your wishlist",
    });
  };

  const isInWishlist = (itemId: string) => {
    return wishlistItems.some(item => item._id === itemId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    if (user?.email) {
      localStorage.removeItem(`wishlist_${user.email}`);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};
