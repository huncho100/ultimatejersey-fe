import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";

import Button from "../ui/Button";

import { maxQuantityFor } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useProductActions } from "../../hooks/useProductActions";

import type { Product } from "../../types/product";

import {
  handleImageError,
  productHeading,
  productImage,
} from "../../utils/catalog";

import { formatNaira } from "../../utils/currency";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {

  const soldOut = maxQuantityFor(product) < 1;

  const { wishlistItems } = useWishlist();

  const {
    addProductToCart,
    toggleProductInWishlist,
  } = useProductActions();

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  /**
   * True while this card's add is on its way to the
   * backend. The button is held closed for that time
   * so a second click cannot start a second add
   * before the first has been confirmed.
   */
  const [adding, setAdding] = useState(false);

  function handleWishlistClick(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    toggleProductInWishlist(product);
  }

  async function handleAddToCart() {
    if (soldOut || adding) return;

    setAdding(true);

    try {
      // One from a card. The quantity picker lives
      // on the product page.
      await addProductToCart(product, 1);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Link
      to={`/products/${product.id}`}
      className="block"
    >
      <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">

        {/* NEW Badge */}

        {product.isNew && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            New
          </span>
        )}

        {/* Wishlist */}

        <button
          onClick={handleWishlistClick}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
          className={`
            absolute
            right-4
            top-4
            z-10
            rounded-full
            p-2
            shadow
            transition-all
            duration-300

            ${
              isWishlisted
                ? "bg-red-500 text-white"
                : "bg-white/90 text-slate-700 hover:bg-red-500 hover:text-white"
            }
          `}
        >
          <Heart
            size={18}
            fill={isWishlisted ? "currentColor" : "none"}
          />
        </button>

        {/* Product Image */}

        <div className="flex h-72 items-center justify-center overflow-hidden bg-slate-100 p-6">
          <img
            src={productImage(product)}
            alt={`${productHeading(product)} ${product.name}`}
            onError={handleImageError}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content */}

        <div className="space-y-4 p-5">

          <div>

            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              {product.sport}
            </p>

            <h3 className="mt-1 text-xl font-bold text-slate-900">
              {productHeading(product)}
            </h3>

            <p className="text-slate-500">
              {product.name}
            </p>

          </div>

          {/* Rating */}

          <div className="flex items-center gap-2">

            <Star
              size={18}
              fill="currentColor"
              className="text-amber-500"
            />

            <span className="font-medium text-slate-700">
              {product.rating}
            </span>

          </div>

          {/* Price */}

          <div className="flex items-center justify-between">

            <div>

              {product.oldPrice && (
                <p className="text-sm text-slate-400 line-through">
                  {formatNaira(product.oldPrice)}
                </p>
              )}

              <p className="text-2xl font-extrabold text-slate-900">
                {formatNaira(product.price)}
              </p>

            </div>

            <div
              onClick={(e) => {
                // The whole card is a link. Adding to
                // the cart must not also navigate.
                e.preventDefault();
                e.stopPropagation();

                void handleAddToCart();
              }}
            >
              <Button disabled={soldOut || adding}>
                {soldOut
                  ? "Out of Stock"
                  : adding
                    ? "Adding..."
                    : "Add to Cart"}
              </Button>
            </div>

          </div>

        </div>

      </div>

    </Link>
  );
}