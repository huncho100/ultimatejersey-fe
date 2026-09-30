import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";

import EmptyCart from "../components/cart/EmptyCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";

import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    cartItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
    hydrated,
    error,
  } = useCart();

  /**
   * The stored cart has not been restored yet, so
   * whether it is empty is not yet known. Saying so
   * before then shows an empty cart to a customer
   * who has one.
   */

  if (!hydrated) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>

          <SectionTitle
            title="Shopping Cart"
            subtitle="Loading your cart..."
            align="left"
          />

        </Container>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>

          <SectionTitle
            title="Shopping Cart"
            subtitle="Review your items before checkout."
            align="left"
          />

          <div className="mt-12">
            <EmptyCart />
          </div>

        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>

        <SectionTitle
          title="Shopping Cart"
          subtitle="Review your items before checkout."
          align="left"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[2fr_380px]">

          {/* Cart Items */}

          <div className="space-y-6">

            {error && (
              <div
                role="alert"
                className="
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

            {cartItems.map((item) => (

              <CartItem
                key={item.id}
                item={item}
                onIncrease={() =>
                  updateQuantity(
                    item.id,
                    item.quantity + 1
                  )
                }
                onDecrease={() =>
                  updateQuantity(
                    item.id,
                    item.quantity - 1
                  )
                }
                onRemove={() =>
                  removeFromCart(item.id)
                }
              />

            ))}

          </div>

          {/* Summary */}

          <CartSummary
            subtotal={totalPrice}
          />

        </div>

      </Container>
    </section>
  );
}