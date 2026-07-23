import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";

import Button from "../ui/Button";

import { useCart } from "../../context/CartContext";

import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {

  const { addToCart } = useCart();

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
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 shadow transition hover:bg-red-500 hover:text-white"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={18} />
        </button>

        {/* Product Image */}

        <div className="flex h-72 items-center justify-center overflow-hidden bg-slate-100 p-6">
          <img
            src={product.image}
            alt={`${product.team} ${product.name}`}
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
              {product.team}
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
                  ${product.oldPrice}
                </p>
              )}

              <p className="text-2xl font-extrabold text-slate-900">
                ${product.price}
              </p>

            </div>

            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addToCart(product);
              }}
            >
              <Button>
                Add to Cart
              </Button>
            </div>

          </div>

        </div>

      </div>

    </Link>
  );
}