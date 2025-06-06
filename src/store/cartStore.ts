import { create } from 'zustand';
import { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  
  addToCart: (productId) => {
    set(state => {
      const existingItem = state.items.find(item => item.productId === productId);
      
      if (existingItem) {
        return {
          items: state.items.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      
      return { 
        items: [...state.items, { productId, quantity: 1 }] 
      };
    });
  },
  
  removeFromCart: (productId) => {
    set(state => ({
      items: state.items.filter(item => item.productId !== productId)
    }));
  },
  
  updateQuantity: (productId, quantity) => {
    set(state => ({
      items: state.items.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      )
    }));
  },
  
  clearCart: () => {
    set({ items: [] });
  },
  
  getItemCount: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));