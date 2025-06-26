import { Heart, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { Button } from '@/components/ui/button';

const WishlistButton = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

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
              {wishlistItems.map((item) => (
                <div key={item._id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <Link to={`/product/${item._id}`} className="font-medium text-[#20283a] hover:text-[#f15a59] line-clamp-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-600">₹{item.price.toLocaleString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromWishlist(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WishlistButton;