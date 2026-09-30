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

import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductsContext";

import { orderService } from "../services/orderService";

import {
  formatNaira,
  parseDecimal,
} from "../utils/currency";

import type { Order } from "../types/order";

/**
 * ===========================================
 * Orders
 * ===========================================
 *
 * The customer's own order history, read from
 * GET /orders.
 *
 * The account page has linked to /orders in two
 * places since it was written, and no such route
 * existed, so both links rendered an empty page.
 * The endpoint and the service call were already
 * there; only this was missing.
 */

/**
 * The backend's order status vocabulary, in the
 * customer's words. Anything unrecognised is shown
 * as it arrived rather than guessed at.
 */
const STATUS_LABELS: Record<string, string> = {
  pending: "Awaiting payment",
  paid: "Paid",
  payment_failed: "Payment failed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  paid: "bg-green-50 text-green-700",
  payment_failed: "bg-red-50 text-red-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-slate-100 text-slate-600",
};

function formatDate(value: string): string {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
}

export default function Orders() {
  const { isAuthenticated, loading: authLoading } =
    useAuth();

  // Order lines carry a product id and a price, not
  // a name. Names come from the catalog already in
  // memory; a product that is no longer listed falls
  // back to its id rather than to a blank row.
  const { products } = useProducts();

  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(
    null
  );

  const names = useMemo(
    () =>
      new Map(
        products.map((product) => [
          product.id,
          product.name,
        ])
      ),
    [products]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setOrders(await orderService.getOrders());
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load your orders."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Who is asking is not known yet, and a signed
    // out visitor must not have the request made on
    // their behalf at all.
    if (authLoading) return;

    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    void load();
  }, [authLoading, isAuthenticated, load]);

  /**
   * ------------------------------------------
   * Signed Out
   * ------------------------------------------
   */

  if (!authLoading && !isAuthenticated) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>

          <SectionTitle
            title="My Orders"
            subtitle="Sign in to see your orders."
            align="left"
          />

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <p className="text-slate-600">
              Your order history is kept with your
              account.
            </p>

            <div className="mt-6 flex justify-center gap-3">

              <Link to="/login">
                <Button>Sign In</Button>
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

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>

        <SectionTitle
          title="My Orders"
          subtitle="Everything you have ordered, and where it has got to."
          align="left"
        />

        <div className="mt-10 space-y-6">

          {/* Loading */}

          {(authLoading || loading) && (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-slate-600">
                Loading your orders...
              </p>
            </div>
          )}

          {/* Failed */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

              <p
                role="alert"
                className="text-red-700"
              >
                {error}
              </p>

              <div className="mt-6">
                <Button onClick={() => void load()}>
                  Try Again
                </Button>
              </div>

            </div>
          )}

          {/* Nothing ordered yet */}

          {!loading &&
            !error &&
            orders.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

                <p className="text-slate-600">
                  You have not placed an order yet.
                </p>

                <div className="mt-6">
                  <Link to="/products">
                    <Button>
                      Start Shopping
                    </Button>
                  </Link>
                </div>

              </div>
            )}

          {/* Orders */}

          {!loading &&
            !error &&
            orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Order #{order.id}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Placed{" "}
                      {formatDate(order.created_at)}
                    </p>

                  </div>

                  <span
                    className={`
                      rounded-full
                      px-3
                      py-1
                      text-sm
                      font-semibold

                      ${
                        STATUS_STYLES[
                          order.status
                        ] ??
                        "bg-slate-100 text-slate-600"
                      }
                    `}
                  >
                    {STATUS_LABELS[order.status] ??
                      order.status}
                  </span>

                </div>

                <div className="mt-5 divide-y divide-slate-200 border-t border-slate-200">

                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-wrap items-center justify-between gap-2 py-3"
                    >

                      <div className="min-w-0">

                        <p className="truncate font-medium text-slate-900">
                          {names.get(
                            item.product_id
                          ) ??
                            `Product #${item.product_id}`}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                          {item.quantity} ×{" "}
                          {formatNaira(
                            parseDecimal(
                              item.unit_price
                            )
                          )}
                        </p>

                      </div>

                      <p className="font-semibold text-slate-900">
                        {formatNaira(
                          parseDecimal(item.subtotal)
                        )}
                      </p>

                    </div>
                  ))}

                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">

                  <span className="font-semibold text-slate-600">
                    Total
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatNaira(
                      parseDecimal(
                        order.total_amount
                      )
                    )}
                  </span>

                </div>

              </article>
            ))}

        </div>

      </Container>
    </section>
  );
}
