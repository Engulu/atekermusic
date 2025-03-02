import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import type { Song } from '../types';

interface CartItem extends Song {
  quantity: number;
}

interface GuestInfo {
  email?: string;
  phoneNumber?: string;
}

interface CartContextType {
  items: CartItem[];
  guestInfo: GuestInfo;
  setGuestInfo: (info: GuestInfo) => void;
  addToCart: (song: Song) => void;
  removeFromCart: (songId: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType>({
  items: [],
  guestInfo: {},
  setGuestInfo: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  total: 0
});

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({});
  const { currentUser } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    const savedGuestInfo = localStorage.getItem('guestInfo');
    
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
    if (savedGuestInfo) {
      setGuestInfo(JSON.parse(savedGuestInfo));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // Save guest info to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(guestInfo).length > 0) {
      localStorage.setItem('guestInfo', JSON.stringify(guestInfo));
    }
  }, [guestInfo]);

  const addToCart = (song: Song) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === song.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === song.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...song, quantity: 1 }];
    });
  };

  const removeFromCart = (songId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== songId));
  };

  const clearCart = () => {
    setItems([]);
    setGuestInfo({});
    localStorage.removeItem('cart');
  };

  const total = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      guestInfo,
      setGuestInfo,
      addToCart, 
      removeFromCart, 
      clearCart, 
      total 
    }}>
      {children}
    </CartContext.Provider>
  );
}