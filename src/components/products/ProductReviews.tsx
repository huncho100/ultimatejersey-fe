import { MessageSquare, Star } from "lucide-react";

import type { Product } from "../../types/product";

/**
 * ===========================================
 * Product Reviews
 * ===========================================
 *
 * What the store actually knows about this product's
 * reception, which at present is one number.
 *
 * There is no review anywhere in this system: no
 * reviews table, no endpoint, nothing on the product
 * response but a single `rating` column that an
 * administrator types in. So this panel shows that
 * rating, says where it came from, and says that
 * customer reviews are not open. It does not invent
 * a review count, star histogram, or "be the first
 * to review" form that would post nowhere.
 *
 * What it would take to make reviews real -- the
 * model, the endpoints and the validation -- is
 * written up in docs/reviews-backend.md.
 */

interface ProductReviewsProps {
  product: Product;
}

export default function ProductReviews({
  product,
}: ProductReviewsProps) {
  const hasRating = product.rating > 0;

  return (
    <div>

      <h3 className="text-2xl font-bold text-slate-900">
        Reviews
      </h3>

      {/* Store rating */}

      {hasRating && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-slate-50 p-5">

          <Star
            size={22}
            fill="currentColor"
            className="text-amber-500"
            aria-hidden="true"
          />

          <div>

            <p className="font-semibold text-slate-900">
              {product.rating} out of 5
            </p>

            <p className="mt-1 text-sm text-slate-600">
              Set by Ultimate Kits on this product.
              It is not an average of customer
              reviews.
            </p>

          </div>

        </div>
      )}

      {/* Customer reviews */}

      <div className="mt-6 flex gap-4 rounded-2xl border border-slate-200 p-5">

        <MessageSquare
          size={22}
          className="mt-0.5 shrink-0 text-slate-400"
          aria-hidden="true"
        />

        <div>

          <p className="font-semibold text-slate-900">
            No customer reviews yet
          </p>

          <p className="mt-2 leading-7 text-slate-600">
            Ultimate Kits is not collecting customer
            reviews at the moment, so there are none
            to show for this product or any other.
            When reviews open, they will appear here.
          </p>

        </div>

      </div>

    </div>
  );
}
