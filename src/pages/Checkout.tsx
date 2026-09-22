import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

import { orderService } from "../services/orderService";
import { cartService } from "../services/cartService";
import { paymentService } from "../services/paymentService";

import {
  handleImageError,
  productImage,
} from "../utils/catalog";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();

  const {
    isAuthenticated,
  } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
              an order.
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
   * Create Order
   * ------------------------------------------
   */

  async function handlePlaceOrder() {
    if (loading) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      await cartService.syncCart(
        cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        }))
      );

      const order =
        await orderService.createOrder();

      const payment =
        await paymentService.initialize(order.id);

      clearCart();
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

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-5"
                >

                  <div className="flex min-w-0 items-center gap-4">

                    <img
                      src={productImage(item)}
                      alt={item.name}
                      onError={handleImageError}
                      className="
                        h-20
                        w-20
                        rounded-xl
                        object-cover
                      "
                    />

                    <div className="min-w-0">

                      <h3 className="truncate font-semibold text-slate-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        ${item.price.toFixed(2)} each
                      </p>

                    </div>

                  </div>

                  <p className="shrink-0 font-semibold text-slate-900">
                    $
                    {(
                      item.price *
                      item.quantity
                    ).toFixed(2)}
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
                  {totalItems}
                </span>

              </div>

              <div className="flex justify-between text-slate-600">

                <span>Subtotal</span>

                <span className="font-semibold">
                  ${totalPrice.toFixed(2)}
                </span>

              </div>

              <hr className="border-slate-200" />

              <div className="flex justify-between text-2xl font-bold text-slate-900">

                <span>Total</span>

                <span>
                  ${totalPrice.toFixed(2)}
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
              Your order will be created securely
              before proceeding to payment.
            </p>

          </div>

        </div>

      </Container>
    </section>
  );
}