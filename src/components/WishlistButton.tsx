
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const WishlistButton = () => {
  const [wishlistItems] = useState([]); // This would be managed by a context in a real app

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Heart className="h-5 w-5" />
          {wishlistItems.length > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 bg-[#f15a59] text-white text-xs rounded-full flex items-center justify-center">
              {wishlistItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>My Wishlist</SheetTitle>
          <SheetDescription>
            Your saved items
          </SheetDescription>
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
