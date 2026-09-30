import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import type { CartItem as CartItemType } from "../../types/cart";

import {
  handleImageError,
  productHeading,
  productImage,
} from "../../utils/catalog";

import { formatNaira } from "../../utils/currency";

interface CartItemProps {
  item: CartItemType;

  onIncrease: () => void;

  onDecrease: () => void;

  onRemove: () => void;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-6
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-sm
        md:flex-row
      "
    >
      {/* Product Image */}

      <div
        className="
          flex
          h-40
          w-full
          items-center
          justify-center
          rounded-xl
          bg-slate-100
          p-4
          md:h-32
          md:w-32
          md:flex-shrink-0
        "
      >
        <img
          src={productImage(item)}
          alt={productHeading(item)}
          onError={handleImageError}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      {/* Product Details */}

      <div className="flex flex-1 flex-col justify-between">

        <div>

          <p className="text-sm font-semibold uppercase text-blue-600">
            {item.sport}
          </p>

          <h3 className="mt-1 text-2xl font-bold text-slate-900">
            {productHeading(item)}
          </h3>

          <p className="text-slate-500">
            {item.name}
          </p>

        </div>

        <div
          className="
            mt-6
            flex
            flex-col
            gap-4
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* Quantity Controls */}

          <div
            className="
              flex
              w-fit
              items-center
              gap-4
              rounded-xl
              border
              border-slate-300
              px-4
              py-2
            "
          >
            <button
              onClick={onDecrease}
              // One is the floor. Emptying the line
              // is what Remove is for.
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="
                transition
                hover:text-blue-600
                disabled:cursor-not-allowed
                disabled:text-slate-300
                disabled:hover:text-slate-300
              "
            >
              <Minus size={18} />
            </button>

            <span className="w-6 text-center font-bold">
              {item.quantity}
            </span>

            <button
              onClick={onIncrease}
              aria-label="Increase quantity"
              className="transition hover:text-blue-600"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Price & Remove */}

          <div className="text-left md:text-right">

            <p className="text-2xl font-bold text-slate-900">
              {formatNaira(
                item.price * item.quantity
              )}
            </p>

            <button
              onClick={onRemove}
              className="
                mt-2
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-red-500
                transition-colors
                hover:text-red-700
              "
            >
              <Trash2 size={16} />
              Remove
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}