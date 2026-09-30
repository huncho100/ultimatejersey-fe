import { Minus, Plus } from "lucide-react";

/**
 * ===========================================
 * Quantity Selector
 * ===========================================
 *
 * Controlled. The selected quantity belongs to
 * whoever is going to act on it -- the page that adds
 * to the cart -- rather than to this component, so
 * that what the customer sees here and what gets
 * added are necessarily the same number.
 */

interface QuantitySelectorProps {
  value: number;

  onChange: (quantity: number) => void;

  /**
   * The most that can be selected. Usually the stock
   * the backend will allow.
   */
  max?: number;

  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  onChange,
  max,
  disabled = false,
}: QuantitySelectorProps) {
  const ceiling =
    typeof max === "number" && max > 0
      ? max
      : Infinity;

  // One is the floor. A quantity below it is not an
  // order for less, it is no order at all.
  const atMin = disabled || value <= 1;

  const atMax = disabled || value >= ceiling;

  function increase() {
    if (atMax) return;

    onChange(Math.min(value + 1, ceiling));
  }

  function decrease() {
    if (atMin) return;

    onChange(value - 1);
  }

  const stepClasses = `
    flex
    h-11
    w-11
    items-center
    justify-center
    transition
    hover:bg-slate-100
    disabled:cursor-not-allowed
    disabled:text-slate-300
    disabled:hover:bg-transparent
  `;

  return (
    <div className="space-y-2">

      <h3 className="text-base font-semibold text-slate-900">
        Quantity
      </h3>

      <div
        className="
          flex
          w-fit
          items-center
          overflow-hidden
          rounded-xl
          border
          border-slate-300
          bg-white
          shadow-sm
        "
      >

        <button
          type="button"
          onClick={decrease}
          disabled={atMin}
          aria-label="Decrease quantity"
          className={stepClasses}
        >
          <Minus size={18} />
        </button>

        <div
          aria-live="polite"
          className="
            flex
            h-11
            w-14
            items-center
            justify-center
            border-x
            border-slate-300
            text-base
            font-bold
          "
        >
          {value}
        </div>

        <button
          type="button"
          onClick={increase}
          disabled={atMax}
          aria-label="Increase quantity"
          className={stepClasses}
        >
          <Plus size={18} />
        </button>

      </div>

      {/* Only worth saying once the limit is in reach. */}

      {ceiling !== Infinity && ceiling <= 10 && (
        <p className="text-sm text-amber-600">
          Only {ceiling} left in stock.
        </p>
      )}

    </div>
  );
}
