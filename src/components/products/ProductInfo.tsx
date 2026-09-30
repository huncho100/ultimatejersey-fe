import {
  Star,
  Trophy,
  Shirt,
  Tag,
  CheckCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ProductPrice from "./ProductPrice";
import ProductSizes from "./ProductSizes";
import QuantitySelector from "./QuantitySelector";
import ProductActions from "./ProductActions";

import {
  maxQuantityFor,
} from "../../context/CartContext";
import { useProductActions } from "../../hooks/useProductActions";

import type { Product } from "../../types/product";

import { productHeading } from "../../utils/catalog";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({
  product,
}: ProductInfoProps) {

  const { addProductToCart } = useProductActions();

  const navigate = useNavigate();

  /**
   * The selected quantity lives here rather than
   * inside QuantitySelector, so that the number on
   * screen is the same number Add to Cart and Buy Now
   * act on.
   */
  const [quantity, setQuantity] = useState(1);

  /**
   * True from the click until the cart has accepted
   * the add. Both buttons close for that time, which
   * is also what stops a second click adding the
   * quantity twice.
   */
  const [busy, setBusy] = useState(false);

  /**
   * Buy Now adds and then navigates. A second click
   * landing before the route changes would add the
   * quantity twice, so the guard is a ref: state
   * updates too late to stop the click already in
   * progress.
   */
  const buying = useRef(false);

  const available = maxQuantityFor(product);

  const soldOut = available < 1;

  async function handleAddToCart() {
    if (busy || soldOut) return;

    setBusy(true);

    try {
      await addProductToCart(product, quantity);
    } finally {
      setBusy(false);
    }
  }

  async function handleBuyNow() {
    if (buying.current || busy || soldOut) return;

    buying.current = true;
    setBusy(true);

    try {
      const added = await addProductToCart(
        product,
        quantity
      );

      // Checkout builds its order from the cart. Going
      // there after a refused add would show the
      // customer a checkout for something else --
      // whatever the cart held already, or nothing at
      // all. The notification has already said why.
      if (!added) return;

      // Straight into the existing checkout flow, which
      // creates the order on the backend and starts the
      // Paystack payment. A guest lands on its sign-in
      // prompt with the cart intact.
      navigate("/checkout");
    } finally {
      buying.current = false;
      setBusy(false);
    }
  }

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
          {productHeading(product)}
        </span>

      </nav>

      {/* Product Header */}

      <div>

        <h1 className="text-4xl font-extrabold leading-tight text-slate-900">
          {productHeading(product)}{" "}
          <span className="font-semibold text-slate-600">
            {product.name}
          </span>
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4">

          {/*
            The rating is a field an administrator
            sets on the product. It is not an average
            of customer reviews -- the backend has no
            reviews to average -- so it is labelled
            for what it is, and left out entirely
            when nobody has set one.
          */}

          {product.rating > 0 && (

            <div className="flex items-center gap-2">

              <Star
                size={18}
                fill="currentColor"
                className="text-amber-500"
                aria-hidden="true"
              />

              <span className="font-semibold text-slate-700">
                {product.rating}
              </span>

              <span className="text-sm text-slate-500">
                Product rating
              </span>

            </div>

          )}

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

      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        max={available}
        disabled={soldOut}
      />

      <hr className="border-slate-200" />

      {/* Actions */}

      <ProductActions
        product={product}
        disabled={soldOut}
        busy={busy}
        onAddToCart={() => void handleAddToCart()}
        onBuyNow={() => void handleBuyNow()}
      />

    </div>
  );
}