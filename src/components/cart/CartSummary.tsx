import { useState } from "react";

import Button from "../ui/Button";

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({
  subtotal,
}: CartSummaryProps) {
  const [promoCode, setPromoCode] = useState("");

  const shipping = subtotal > 0 ? 15 : 0;

  const tax = subtotal * 0.075;

  const total = subtotal + shipping + tax;

  return (
    <div
      className="
        sticky
        top-24
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
      "
    >
      {/* Header */}

      <h2 className="text-2xl font-bold text-slate-900">
        Order Summary
      </h2>

      {/* Promo Code */}

      <div className="mt-6">

        <label
          className="
            mb-2
            block
            text-sm
            font-semibold
            text-slate-700
          "
        >
          Promo Code
        </label>

        <div className="flex gap-2">

          <input
            type="text"
            value={promoCode}
            onChange={(e) =>
              setPromoCode(e.target.value)
            }
            placeholder="Enter code"
            className="
              flex-1
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-600
            "
          />

          <Button
            variant="outline"
            size="md"
          >
            Apply
          </Button>

        </div>

      </div>

      {/* Totals */}

      <div className="mt-8 space-y-4">

        <div className="flex justify-between text-slate-600">

          <span>Subtotal</span>

          <span className="font-semibold">
            ${subtotal.toFixed(2)}
          </span>

        </div>

        <div className="flex justify-between text-slate-600">

          <span>Shipping</span>

          <span className="font-semibold">
            ${shipping.toFixed(2)}
          </span>

        </div>

        <div className="flex justify-between text-slate-600">

          <span>Estimated Tax</span>

          <span className="font-semibold">
            ${tax.toFixed(2)}
          </span>

        </div>

        <hr className="border-slate-200" />

        <div className="flex justify-between text-2xl font-bold text-slate-900">

          <span>Grand Total</span>

          <span>${total.toFixed(2)}</span>

        </div>

      </div>

      {/* Checkout */}

      <div className="mt-8">

        <Button
          fullWidth
          size="lg"
        >
          Proceed to Checkout
        </Button>

      </div>

      {/* Trust Message */}

      <p
        className="
          mt-5
          text-center
          text-sm
          text-slate-500
        "
      >
        Secure checkout powered by SSL encryption.
      </p>

    </div>
  );
}