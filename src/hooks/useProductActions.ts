import { useCallback } from "react";

import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../components/ui/Toast";

import type { Product } from "../types/product";

/**
 * ===========================================
 * Product Actions
 * ===========================================
 *
 * Adding to the cart and saving to the wishlist,
 * with the customer told what happened.
 *
 * Gathered into one hook because the alternative is
 * the same three decisions -- wording, tone, and
 * which notification this replaces -- made
 * separately on the product card, the product page
 * and the wishlist, and drifting apart from there.
 *
 * Nothing here decides that an action worked. Both
 * contexts report their own outcome, and this only
 * turns that into something to read.
 */

/**
 * One notification per product per action.
 *
 * Clicking Add to Cart four times replaces the same
 * toast four times instead of stacking four
 * identical ones, while adding two different
 * products still shows two.
 */
function cartKey(product: Product): string {
  return `cart:${product.id}`;
}

function wishlistKey(product: Product): string {
  return `wishlist:${product.id}`;
}

export function useProductActions() {
  const { addToCart } = useCart();

  const { toggleWishlist, removeFromWishlist } =
    useWishlist();

  const toast = useToast();

  /**
   * ------------------------------------------
   * Add To Cart
   * ------------------------------------------
   *
   * Resolves true only when the whole requested
   * quantity is in the cart -- and, for a signed-in
   * customer, in the backend's copy of it.
   */

  const addProductToCart = useCallback(
    async (
      product: Product,
      quantity: number = 1
    ): Promise<boolean> => {
      const outcome = await addToCart(
        product,
        quantity
      );

      if (outcome.status === "added") {
        toast.success(
          outcome.quantity > 1
            ? `${outcome.quantity} × ${product.name} added to your cart.`
            : `${product.name} added to your cart.`,
          { key: cartKey(product) }
        );

        return true;
      }

      if (outcome.status === "problem") {
        toast.error(outcome.message, {
          key: cartKey(product),
        });
      }

      return false;
    },
    [addToCart, toast]
  );

  /**
   * ------------------------------------------
   * Wishlist
   * ------------------------------------------
   */

  const toggleProductInWishlist = useCallback(
    (product: Product) => {
      const outcome = toggleWishlist(product);

      if (outcome.status === "added") {
        toast.success(
          `${product.name} saved to your wishlist.`,
          { key: wishlistKey(product) }
        );
      }

      if (outcome.status === "removed") {
        toast.success(
          `${product.name} removed from your wishlist.`,
          { key: wishlistKey(product) }
        );
      }

      return outcome;
    },
    [toggleWishlist, toast]
  );

  /**
   * ------------------------------------------
   * Move To Cart
   * ------------------------------------------
   *
   * The wishlist entry is given up only once the
   * product is actually in the cart. Removing it
   * first would lose the saved product whenever the
   * add is refused -- out of stock being exactly the
   * case where a customer wants to keep it saved.
   */

  const moveProductToCart = useCallback(
    async (product: Product): Promise<boolean> => {
      const added = await addProductToCart(product);

      if (added) {
        removeFromWishlist(product.id);
      }

      return added;
    },
    [addProductToCart, removeFromWishlist]
  );

  return {
    addProductToCart,
    toggleProductInWishlist,
    moveProductToCart,
  };
}
