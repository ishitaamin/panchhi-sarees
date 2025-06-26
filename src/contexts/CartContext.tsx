import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getToken } from "./AuthContext"; // Adjust path to your auth token getter
import { useToast } from "@/hooks/use-toast"; // Adjust if you have a toast system

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => Promise<void>;
  removeFromCart: (id: string, size?: string, color?: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number, size?: string, color?: string) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = getToken();
        if (!token) {
          setItems([]); // No user logged in, empty cart
          return;
        }

        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Transform backend cart data if needed to match CartItem interface
        const backendCart = res.data.cart.map((c: any) => ({
          id: c.product._id,
          name: c.product.name,
          price: c.product.price,
          image: c.product.image,
          quantity: c.quantity,
          size: c.size,
          color: c.color,
        }));

        setItems(backendCart);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        toast({ title: "Failed to load cart", variant: "destructive" });
      }
    };

    fetchCart();
  }, [toast]);

  const addToCart = async (item: Omit<CartItem, "quantity">, quantity = 1) => {
    try {
      const token = getToken();
      if (!token) {
        toast({ title: "Please log in to add items", variant: "destructive" });
        return;
      }

      const res = await axios.post(
        "http://localhost:5000/api/users/cart",
        { productId: item.id, quantity, size: item.size, color: item.color },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local cart from server response
      const backendCart = res.data.cart.map((c: any) => ({
        id: c.product._id,
        name: c.product.name,
        price: c.product.price,
        image: c.product.image,
        quantity: c.quantity,
        size: c.size,
        color: c.color,
      }));

      setItems(backendCart);
      toast({ title: "Added to cart" });
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast({ title: "Failed to add to cart", variant: "destructive" });
    }
  };

  const removeFromCart = async (id: string, size?: string, color?: string) => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.delete(
        "http://localhost:5000/api/users/cart",
        {
          data: { productId: id, size, color },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const backendCart = res.data.cart.map((c: any) => ({
        id: c.product._id,
        name: c.product.name,
        price: c.product.price,
        image: c.product.image,
        quantity: c.quantity,
        size: c.size,
        color: c.color,
      }));

      setItems(backendCart);
      toast({ title: "Removed from cart" });
    } catch (err) {
      console.error("Remove from cart failed:", err);
      toast({ title: "Failed to remove from cart", variant: "destructive" });
    }
  };

  const updateQuantity = async (
    id: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      await removeFromCart(id, size, color);
      return;
    }

    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.post(
        "http://localhost:5000/api/users/cart",
        { productId: id, quantity, size, color },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const backendCart = res.data.cart.map((c: any) => ({
        id: c.product._id,
        name: c.product.name,
        price: c.product.price,
        image: c.product.image,
        quantity: c.quantity,
        size: c.size,
        color: c.color,
      }));

      setItems(backendCart);
    } catch (err) {
      console.error("Update cart quantity failed:", err);
      toast({ title: "Failed to update cart", variant: "destructive" });
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};