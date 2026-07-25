import { Link } from "react-router-dom";

export default function EmptyWishlist() {
  return (
    <div className="rounded-3xl bg-white p-16 text-center shadow-sm">

      <h2 className="text-3xl font-bold">
        Your wishlist is empty
      </h2>

      <p className="mt-4 text-slate-500">
        Save your favourite jerseys and they'll appear here.
      </p>

      <Link
        to="/products"
        className="
          mt-8
          inline-flex
          rounded-xl
          bg-blue-600
          px-6
          py-3
          font-semibold
          text-white
          transition
          hover:bg-blue-700
        "
      >
        Browse Jerseys
      </Link>

    </div>
  );
}