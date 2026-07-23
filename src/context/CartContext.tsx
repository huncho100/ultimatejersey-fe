import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import type { Product } from "../types/product";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];

  addToCart: (product: Product) => void;

  removeFromCart: (id: number) => void;

  updateQuantity: (
    id: number,
    quantity: number
  ) => void;

  clearCart: () => void;

  totalItems: number;

  totalPrice: number;
}

const CartContext =
  createContext<CartContextType | null>(null);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({
  children,
}: CartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id: number) {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  function updateQuantity(
    id: number,
    quantity: number
  ) {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  const totalItems = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    [cartItems]
  );

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}