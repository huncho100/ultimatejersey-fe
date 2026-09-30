import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Product } from "../types/product";

/**
 * ===========================================
 * Outcomes
 * ===========================================
 *
 * What a wishlist change actually did, so that a
 * caller can confirm it to the customer without
 * having to work out for itself whether anything
 * moved.
 *
 * "unchanged" covers saving something already saved
 * and removing something that is not there. Neither
 * is an error, and neither is worth announcing.
 */
export type WishlistOutcome =
  | { status: "added" }
  | { status: "removed" }
  | { status: "unchanged" };

/**
 * ===========================================
 * Context
 * ===========================================
 *
 * The wishlist lives in memory for the current
 * page session only. There is no wishlist table or
 * endpoint on the backend, and nothing is written to
 * storage, so a refresh empties it. Recorded here
 * because it is a known limitation rather than a
 * bug to be discovered later.
 */

interface WishlistContextType {
  wishlistItems: Product[];

  addToWishlist: (
    product: Product
  ) => WishlistOutcome;

  removeFromWishlist: (
    id: number
  ) => WishlistOutcome;

  toggleWishlist: (
    product: Product
  ) => WishlistOutcome;

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

  /**
   * The committed list, readable synchronously.
   *
   * These functions report what they did as they
   * return, so they cannot read the list out of a
   * render that a click earlier in the same tick has
   * already made stale -- two fast clicks on the
   * heart would both see "not saved" and both claim
   * to have saved it.
   */
  const itemsRef = useRef<Product[]>([]);

  const apply = useCallback((items: Product[]) => {
    itemsRef.current = items;

    setWishlistItems(items);
  }, []);

  const addToWishlist = useCallback(
    (product: Product): WishlistOutcome => {
      const current = itemsRef.current;

      if (
        current.some(
          (item) => item.id === product.id
        )
      ) {
        return { status: "unchanged" };
      }

      apply([...current, product]);

      return { status: "added" };
    },
    [apply]
  );

  const removeFromWishlist = useCallback(
    (id: number): WishlistOutcome => {
      const current = itemsRef.current;

      const next = current.filter(
        (item) => item.id !== id
      );

      if (next.length === current.length) {
        return { status: "unchanged" };
      }

      apply(next);

      return { status: "removed" };
    },
    [apply]
  );

  const toggleWishlist = useCallback(
    (product: Product): WishlistOutcome =>
      itemsRef.current.some(
        (item) => item.id === product.id
      )
        ? removeFromWishlist(product.id)
        : addToWishlist(product),
    [addToWishlist, removeFromWishlist]
  );

  const isInWishlist = useCallback(
    (id: number) =>
      wishlistItems.some((item) => item.id === id),
    [wishlistItems]
  );

  const clearWishlist = useCallback(() => {
    apply([]);
  }, [apply]);

  const totalWishlistItems = wishlistItems.length;

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      totalWishlistItems,
    }),
    [
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      totalWishlistItems,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
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
