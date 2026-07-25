import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";

export default function EmptyCart() {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        px-8
        py-16
        text-center
        shadow-sm
      "
    >
      {/* Icon */}

      <div
        className="
          mx-auto
          flex
          h-24
          w-24
          items-center
          justify-center
          rounded-full
          bg-blue-50
        "
      >
        <ShoppingBag
          size={42}
          className="text-blue-600"
        />
      </div>

      {/* Heading */}

      <h2 className="mt-8 text-3xl font-bold text-slate-900">
        Your cart is empty
      </h2>

      <p className="mx-auto mt-4 max-w-md text-slate-500">
        Looks like you haven't added any items yet.
        Browse our latest football, basketball,
        retro and national team collections.
      </p>

      {/* CTA */}

      <div className="mt-10">

        <Link to="/products">

          <Button size="lg">
            Continue Shopping
          </Button>

        </Link>

      </div>

      {/* Secondary Link */}

      <div className="mt-6">

        <Link
          to="/"
          className="
            text-sm
            font-medium
            text-blue-600
            transition
            hover:text-blue-700
          "
        >
          ← Return to Homepage
        </Link>

      </div>

    </div>
  );
}