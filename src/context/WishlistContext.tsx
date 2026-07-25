import {
  createContext,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

import type { Product } from "../types/product";

interface WishlistContextType {
  wishlistItems: Product[];

  addToWishlist: (product: Product) => void;

  removeFromWishlist: (id: number) => void;

  toggleWishlist: (product: Product) => void;

  isInWishlist: (id: number) => boolean;

  clearWishlist: () => void;

  totalWishlistItems: number;
}

const WishlistContext =
  createContext<WishlistContextType | null>(null);

interface WishlistProviderProps {
  children: ReactNode;
}

export function WishlistProvider({
  children,
}: WishlistProviderProps) {
  const [wishlistItems, setWishlistItems] =
    useState<Product[]>([]);

  function addToWishlist(product: Product) {
    setWishlistItems((prev) => {
      if (
        prev.some((item) => item.id === product.id)
      ) {
        return prev;
      }

      return [...prev, product];
    });
  }

  function removeFromWishlist(id: number) {
    setWishlistItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  }

  function toggleWishlist(product: Product) {
    const exists = wishlistItems.some(
      (item) => item.id === product.id
    );

    if (exists) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }

  function isInWishlist(id: number) {
    return wishlistItems.some(
      (item) => item.id === id
    );
  }

  function clearWishlist() {
    setWishlistItems([]);
  }

  const totalWishlistItems = useMemo(
    () => wishlistItems.length,
    [wishlistItems]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        totalWishlistItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}