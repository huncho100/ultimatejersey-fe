import { Star } from "lucide-react";
import Button from "../ui/Button";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      
      {/* Image */}
      <div className="flex h-72 items-center justify-center bg-slate-100">
        <span className="text-slate-400">
          Image Coming Soon
        </span>
      </div>

      {/* Content */}
      <div className="space-y-3 p-5">
        <div>
          <p className="text-sm uppercase tracking-wide text-blue-600">
            {product.sport}
          </p>

          <h3 className="mt-1 text-xl font-bold">
            {product.team}
          </h3>

          <p className="text-slate-500">
            {product.name}
          </p>
        </div>

        <div className="flex items-center gap-1 text-amber-500">
          <Star fill="currentColor" size={18} />
          <span className="font-medium">
            {product.rating}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-extrabold text-slate-900">
            ${product.price}
          </p>

          <Button>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}