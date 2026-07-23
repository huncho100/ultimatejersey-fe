import {
  Star,
  Trophy,
  Shirt,
  Tag,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import ProductPrice from "./ProductPrice";
import ProductSizes from "./ProductSizes";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";

import { useCart } from "../../context/CartContext";

import type { Product } from "../../types/product";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {

  const { addToCart } = useCart();

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}

      <nav className="flex items-center gap-2 text-sm text-slate-500">

        <Link
          to="/"
          className="hover:text-blue-600"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          to="/products"
          className="hover:text-blue-600"
        >
          Products
        </Link>

        <span>/</span>

        <span className="font-medium text-slate-700">
          {product.team}
        </span>

      </nav>

      {/* Product Header */}

      <div>

        <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
          {product.team}{" "}
          <span className="font-semibold text-slate-600">
            {product.name}
          </span>
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4">

          <div className="flex items-center gap-2">

            <Star
              size={18}
              fill="currentColor"
              className="text-amber-500"
            />

            <span className="font-semibold text-slate-700">
              {product.rating}
            </span>

            <span className="text-sm text-slate-500">
              (128 Reviews)
            </span>

          </div>

          {product.inStock && (
            <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
              <CheckCircle size={16} />
              In Stock
            </div>
          )}

        </div>

      </div>

      {/* Product Tags */}

      <div className="flex flex-wrap gap-3">

        <span className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          ⚽ {product.sport}
        </span>

        {product.league && (
          <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            <Trophy size={14} />
            {product.league}
          </span>
        )}

        {product.brand && (
          <span className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
            <Shirt size={14} />
            {product.brand}
          </span>
        )}

        <span className="flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
          <Tag size={14} />
          {product.category}
        </span>

      </div>

      <hr className="border-slate-200" />

      {/* Price */}

      <ProductPrice
        price={product.price}
        oldPrice={product.oldPrice}
      />

      <hr className="border-slate-200" />

      {/* Sizes */}

      <ProductSizes
        sizes={product.sizes}
      />

      <hr className="border-slate-200" />

      {/* Quantity */}

      <QuantitySelector />

      <hr className="border-slate-200" />

      {/* Actions */}

      <ProductActions
        onAddToCart={() => addToCart(product)}
      />

    </div>
  );
}