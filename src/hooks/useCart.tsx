import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  quantity: number;
  selectedColor?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, color) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { productId, quantity: 1, selectedColor: color }],
          };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'saho-cart-storage',
    }
  )
);
