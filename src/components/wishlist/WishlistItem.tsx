import {
  ShoppingCart,
  Trash2,
} from "lucide-react";

import type { Product } from "../../types/product";

interface WishlistItemProps {
  item: Product;

  onMoveToCart: () => void;

  onRemove: () => void;
}

export default function WishlistItem({
  item,
  onMoveToCart,
  onRemove,
}: WishlistItemProps) {
  return (
    <div className="flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      {/* Image */}

      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 p-2">

        <img
          src={item.image}
          alt={item.team}
          className="max-h-full object-contain"
        />

      </div>

      {/* Content */}

      <div className="flex flex-1 items-center justify-between">

        {/* Product Info */}

        <div>

          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {item.sport}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {item.team}
          </h2>

          <p className="text-slate-500">
            {item.name}
          </p>

          <div className="mt-2">

            {item.oldPrice && (
              <p className="text-sm text-slate-400 line-through">
                ${item.oldPrice}
              </p>
            )}

            <p className="text-xl font-bold text-slate-900">
              ${item.price}
            </p>

          </div>

        </div>

        {/* Actions */}

        <div className="flex flex-col gap-2 md:flex-row">

          <button
            onClick={onMoveToCart}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <ShoppingCart size={16} />
            Move to Cart
          </button>

          <button
            onClick={onRemove}
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-red-300
              px-4
              py-2
              text-sm
              font-semibold
              text-red-500
              transition
              hover:bg-red-50
              hover:border-red-500
            "
          >
            <Trash2 size={16} />
            Remove
          </button>

        </div>

      </div>

    </div>
  );
}