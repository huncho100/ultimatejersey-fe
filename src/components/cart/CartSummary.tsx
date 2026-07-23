interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({
  subtotal,
}: CartSummaryProps) {
  const shipping = subtotal > 0 ? 15 : 0;

  const total = subtotal + shipping;

  return (
    <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-2xl font-bold">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">

        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between text-xl font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

      </div>

      <button
        className="
          mt-8
          w-full
          rounded-xl
          bg-blue-600
          py-3
          font-semibold
          text-white
          transition
          hover:bg-blue-700
        "
      >
        Proceed to Checkout
      </button>

    </div>
  );
}