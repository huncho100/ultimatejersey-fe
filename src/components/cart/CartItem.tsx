import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import type { CartItem as CartItemType } from "../../context/CartContext";

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
    <div className="flex gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Image */}

      <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-slate-100 p-3">

        <img
          src={item.image}
          alt={item.team}
          className="max-h-full object-contain"
        />

      </div>

      {/* Info */}

      <div className="flex flex-1 flex-col justify-between">

        <div>

          <p className="text-sm font-semibold uppercase text-blue-600">
            {item.sport}
          </p>

          <h3 className="text-2xl font-bold">
            {item.team}
          </h3>

          <p className="text-slate-500">
            {item.name}
          </p>

        </div>

        <div className="flex items-center justify-between">

          {/* Quantity */}

          <div className="flex items-center gap-3 rounded-xl border px-3 py-2">

            <button onClick={onDecrease}>
              <Minus size={16} />
            </button>

            <span className="w-6 text-center font-bold">
              {item.quantity}
            </span>

            <button onClick={onIncrease}>
              <Plus size={16} />
            </button>

          </div>

          {/* Price */}

          <div className="text-right">

            <p className="text-xl font-bold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={onRemove}
              className="mt-2 flex items-center gap-2 text-sm text-red-500 hover:text-red-700"
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