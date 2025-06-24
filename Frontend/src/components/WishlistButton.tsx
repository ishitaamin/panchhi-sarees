import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

const WishlistButton = () => {
  const [wishlistItems] = useState([]); // Replace with context state when integrated

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Link
          to="#"
          className="relative p-2 text-[#20283a] hover:text-[#f15a59] transition-colors"
        >
          <Heart className="h-6 w-6" />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#f15a59] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
        </Link>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Wishlist</SheetTitle>
          <SheetDescription>Your saved items</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {wishlistItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Your wishlist is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Wishlist items would be displayed here */}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistButton;