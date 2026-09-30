import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";

import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { orderService } from "../services/orderService";
import {
  cartService,
  type ApiCart,
} from "../services/cartService";
import { paymentService } from "../services/paymentService";

import {
  handleImageError,
  productImage,
} from "../utils/catalog";

import {
  formatNaira,
  parseDecimal,
} from "../utils/currency";

import type { CartItem } from "../types/cart";

/**
 * One line of the order summary.
 *
 * confirmed marks where the figures came from: the
 * backend's own pricing, or the browser's copy of it
 * while the backend has not answered yet.
 */
interface SummaryLine {
  productId: number;
  product?: CartItem;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export default function Checkout() {
  const { cartItems, hydrated } = useCart();

  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * The backend's view of this cart: quantities it
   * has accepted, priced from the products table.
   * This is what the summary shows, because it is
   * what the order will be built from.
   */
  const [serverCart, setServerCart] =
    useState<ApiCart | null>(null);

  const canCheckout =
    hydrated &&
    isAuthenticated &&
    cartItems.length > 0;

  /**
   * ------------------------------------------
   * Confirm The Cart With The Backend
   * ------------------------------------------
   *
   * A replace, so the backend ends up holding
   * exactly what is on screen, and repeating it
   * changes nothing. Running it here means stock and
   * pricing problems surface on the summary rather
   * than after the customer has committed to paying.
   */

  const confirmCart =
    useCallback(async (): Promise<ApiCart> => {
      const cart = await cartService.syncCart(
        cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }))
      );

      setServerCart(cart);

      return cart;
    }, [cartItems]);

  useEffect(() => {
    if (!canCheckout) return;

    let cancelled = false;

    confirmCart().catch((caught) => {
      if (cancelled) return;

      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to confirm your cart."
      );
    });

    return () => {
      cancelled = true;
    };
  }, [canCheckout, confirmCart]);

  /**
   * ------------------------------------------
   * Summary
   * ------------------------------------------
   */

  const summary = useMemo(() => {
    const products = new Map(
      cartItems.map((item) => [item.id, item])
    );

    const lines: SummaryLine[] = serverCart
      ? serverCart.items.map((line) => ({
          productId: line.product_id,
          product: products.get(line.product_id),
          quantity: line.quantity,
          unitPrice: parseDecimal(line.unit_price),
          subtotal: parseDecimal(line.subtotal),
        }))
      : cartItems.map((item) => ({
          productId: item.id,
          product: item,
          quantity: item.quantity,
          unitPrice: item.price,
          subtotal: item.price * item.quantity,
        }));

    return {
      confirmed: serverCart !== null,
      lines,
      totalItems: lines.reduce(
        (sum, line) => sum + line.quantity,
        0
      ),
      total: lines.reduce(
        (sum, line) => sum + line.subtotal,
        0
      ),
    };
  }, [serverCart, cartItems]);

  /**
   * ------------------------------------------
   * Place Order
   * ------------------------------------------
   */

  async function handlePlaceOrder() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await confirmCart();

      // The backend prices the order from the
      // products table and Paystack is initialised
      // from the order it created. Nothing the
      // browser worked out is sent as the amount.
      const order =
        await orderService.createOrder();

      const payment =
        await paymentService.initialize(order.id);

      // The cart is deliberately left alone. The
      // backend empties it when the payment actually
      // settles, so a customer whose card is
      // declined comes back to a cart they can
      // retry with rather than an empty one.
      window.location.assign(
        payment.authorization_url
      );

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create your order.";

      setError(message);

      setLoading(false);
    }
  }

  /**
   * ------------------------------------------
   * Loading
   * ------------------------------------------
   *
   * The stored cart has not been restored yet, so
   * whether it is empty is not yet known.
   */

  if (!hydrated) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>

          <SectionTitle
            title="Checkout"
            subtitle="Loading your cart..."
            align="left"
          />

        </Container>
      </section>
    );
  }

  /**
   * ------------------------------------------
   * Empty Cart
   * ------------------------------------------
   */

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>

          <SectionTitle
            title="Checkout"
            subtitle="Your cart is empty."
            align="left"
          />

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <p className="text-slate-600">
              Add some products to your cart
              before proceeding to checkout.
            </p>

            <div className="mt-6">
              <Link to="/products">
                <Button>
                  Continue Shopping
                </Button>
              </Link>
            </div>

          </div>

        </Container>
      </section>
    );
  }

  /**
   * ------------------------------------------
   * Authentication
   * ------------------------------------------
   *
   * The cart survives this. It is stored locally
   * for a guest, and merged into their account cart
   * once they sign in.
   */

  if (!isAuthenticated) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>

          <SectionTitle
            title="Checkout"
            subtitle="Please sign in before completing your order."
            align="left"
          />

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <p className="text-slate-600">
              You need to be logged in to place
              an order. Your cart will be waiting
              for you.
            </p>

            <div className="mt-6 flex justify-center gap-3">

              <Link to="/login">
                <Button>
                  Sign In
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="outline">
                  Create Account
                </Button>
              </Link>

            </div>

          </div>

        </Container>
      </section>
    );
  }

  /**
   * ------------------------------------------
   * Checkout
   * ------------------------------------------
   */

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>

        <SectionTitle
          title="Checkout"
          subtitle="Review your order before payment."
          align="left"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_380px]">

          {/* ---------------------------------
              Order Items
          ---------------------------------- */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Your Order
            </h2>

            <div className="mt-6 divide-y divide-slate-200">

              {summary.lines.map((line) => (
                <div
                  key={line.productId}
                  className="flex items-center justify-between gap-4 py-5"
                >

                  <div className="flex min-w-0 items-center gap-4">

                    {line.product && (
                      <img
                        src={productImage(
                          line.product
                        )}
                        alt={line.product.name}
                        onError={handleImageError}
                        className="
                          h-20
                          w-20
                          rounded-xl
                          object-cover
                        "
                      />
                    )}

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-slate-900">
                        {line.product?.name ??
                          `Product #${line.productId}`}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Quantity: {line.quantity}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {formatNaira(
                          line.unitPrice
                        )}{" "}
                        each
                      </p>

                    </div>

                  </div>

                  <p className="shrink-0 font-semibold text-slate-900">
                    {formatNaira(line.subtotal)}
                  </p>

                </div>
              ))}

            </div>

          </div>

          {/* ---------------------------------
              Order Summary
          ---------------------------------- */}

          <div
            className="
              sticky
              top-24
              h-fit
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
          >

            <h2 className="text-2xl font-bold text-slate-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between text-slate-600">

                <span>Items</span>

                <span className="font-semibold">
                  {summary.totalItems}
                </span>

              </div>

              <div className="flex justify-between text-slate-600">

                <span>Subtotal</span>

                <span className="font-semibold">
                  {formatNaira(summary.total)}
                </span>

              </div>

              <hr className="border-slate-200" />

              <div className="flex justify-between text-2xl font-bold text-slate-900">

                <span>Total</span>

                <span>
                  {formatNaira(summary.total)}
                </span>

              </div>

            </div>

            {error && (
              <div
                className="
                  mt-6
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  p-4
                  text-sm
                  text-red-700
                "
              >
                {error}
              </div>
            )}

            <div className="mt-8">

              <Button
                fullWidth
                size="lg"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading
                  ? "Creating Order..."
                  : "Place Order"}
              </Button>

            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
              {summary.confirmed
                ? "Confirmed with our store. Payment is taken in Naira."
                : "Amounts are confirmed by our store before payment."}
            </p>

          </div>

        </div>

      </Container>
    </section>
  );
}
