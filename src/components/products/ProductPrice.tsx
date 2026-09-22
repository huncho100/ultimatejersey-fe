interface ProductPriceProps {
  price: number;

  // Nullable on the API, not merely absent.
  oldPrice?: number | null;
}

export default function ProductPrice({
  price,
  oldPrice,
}: ProductPriceProps) {
  const hasDiscount =
    oldPrice !== undefined &&
    oldPrice !== null &&
    oldPrice > price;

  const discount = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-end gap-3">

        {/* Current Price */}

        <span className="text-3xl font-extrabold text-slate-900">
          ${price}
        </span>

        {/* Old Price */}

        {hasDiscount && (
          <span className="pb-1 text-lg text-slate-400 line-through">
            ${oldPrice}
          </span>
        )}

      </div>

      {/* Discount */}

      {hasDiscount && (
        <div className="mt-3 flex flex-wrap items-center gap-2">

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
            {discount}% OFF
          </span>

          <span className="text-sm text-slate-500">
            Save
            <span className="ml-1 font-semibold text-slate-700">
              ${oldPrice! - price}
            </span>
          </span>

        </div>
      )}

    </div>
  );
}