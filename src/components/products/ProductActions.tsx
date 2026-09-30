import {
  Heart,
  ShoppingCart,
  CreditCard,
} from "lucide-react";

import Button from "../ui/Button";

import { useWishlist } from "../../context/WishlistContext";
import { useProductActions } from "../../hooks/useProductActions";

import type { Product } from "../../types/product";

interface ProductActionsProps {
  product: Product;

  disabled?: boolean;

  /** True while the add is still in flight. */
  busy?: boolean;

  onAddToCart?: () => void;

  onBuyNow?: () => void;
}

export default function ProductActions({
  product,
  disabled = false,
  busy = false,
  onAddToCart,
  onBuyNow,
}: ProductActionsProps) {

  const { wishlistItems } = useWishlist();

  const { toggleProductInWishlist } =
    useProductActions();

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  function handleWishlist() {
    toggleProductInWishlist(product);
  }

  return (
    <div className="space-y-3">

      {/* Add to Cart */}

      <Button
        size="sm"
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          py-2
          text-base
        "
        disabled={disabled || busy}
        onClick={onAddToCart}
      >
        <ShoppingCart size={18} />
        {busy ? "Adding..." : "Add to Cart"}
      </Button>

      {/* Buy Now */}

      <Button
        variant="outline"
        size="sm"
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          py-2
          text-base
        "
        disabled={disabled || busy}
        onClick={onBuyNow}
      >
        <CreditCard size={18} />
        Buy Now
      </Button>

      {/* Wishlist */}

      <button
        type="button"
        onClick={handleWishlist}
        className={`
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          py-2
          text-base
          font-medium
          transition-colors

          ${
            isWishlisted
              ? "border-red-500 bg-red-500 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-red-500 hover:text-red-500"
          }
        `}
      >
        <Heart
          size={18}
          fill={isWishlisted ? "currentColor" : "none"}
        />

        {isWishlisted
          ? "Remove from Wishlist"
          : "Add to Wishlist"}
      </button>

    </div>
  );
}